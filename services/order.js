/* eslint-disable no-undef */
const braintree = require("braintree");
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Shipment = require('../models/shipment');
const Store = require('../models/store');
const Discount = require('../models/discount');
const customError = require('../functions/errorHandler');
const { isEmpty } = require('../functions/checks');
const mongoose = require('mongoose');


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: `${process.env.BRAINREE_MERCHANT_ID}`,
    publicKey: `${process.env.BRAINREE_PUBLIC_ID}`,
    privateKey: `${process.env.BRAINREE_PRIVATE_ID}`
});

// check that user is logged-in
function userIsLoggedin(loggedUser) {
    if (!loggedUser) customError("UNAUTHORIZED", 401);
}
// get braintree payment tokens
const getPaymentToken = async (req, res) => {
    await gateway.clientToken.generate({}).then((response) => {
        return res.status(200).json({ token: response.clientToken });
    });
};


// check all cart items are valid and available for purchase
async function cartItemsAreValid(cartItems) {
    for (const item of cartItems) {
        const product = await Product.findById(item.productId);

        if (!product) customError("PRODUCT_NOT_FOUND", 404);

        if (product.quantity === 0) customError("PRODUCT_OUT_OF_STOCK", 400);

        if (item.quantity > product.quantity)
            customError("ITEM_QUANTITY_EXCEEDS_AVAILABLE_QUANTITY", 400);
    }
}

/*
    shipmentAndDiscount: {
        shipmentId: "...", (ObjectId)
        discountCode: "..." (String)
    }
*/
const createOrder = async (userId, shipmentAndDiscount, nonce) => {
    let orderPrice = 0;
    const loggedUser = await User.findById(userId);

    // check
    userIsLoggedin(loggedUser);
    isEmpty(shipmentAndDiscount);

    if (!shipmentAndDiscount.shipmentId) customError("SHIPMENT_ID_NOT_PROVIDED", 400);
    const shipmentData = await Shipment.findById(shipmentAndDiscount.shipmentId)

    const userCart = await Cart.findOne({ userId: userId });
    const cartItems = await CartItem.find({ cartId: userCart._id }); // array

    if (cartItems.length === 0) customError("CART_IS_EMPTY", 400);

    orderPrice = userCart.totalprice;

    // check that the discont code (if provided) exists in database and valid
    if (shipmentAndDiscount.discountCode) {
        const discountCode = await Discount.findOne({ code: shipmentAndDiscount.discountCode });
        if (!discountCode) customError("DISCOUNT_CODE_NOT_FOUND", 404);

        if (!discountCode.valid) customError("INVALID_DISCOUNT_CODE", 400);

        orderPrice = userCart.totalprice * (1 - discountCode.discountPercent / 100);
    }

    // Create initial order data
    let orderData = new Order({
        name: shipmentData.firstName + " " + shipmentData.lastName,
        address: shipmentData.address,
        phoneNumber: shipmentData.phoneNumber,
        userId: userId,
        totalprice: orderPrice
    });

    try {
        // check the validity of cart items
        cartItemsAreValid(cartItems);

        // create orderItems
        let totalItems = 0;
        for (const item of cartItems) {
            totalItems += item.quantity;
            const product = await Product.findById(item.productId);
            await OrderItem.create({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
                orderId: orderData._id,
                vendorId: product.vendorId
            });
            await CartItem.findByIdAndDelete(item._id);
            await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
        }

        orderData.totalProducts = totalItems;
        await Cart.findByIdAndUpdate(userCart._id, { $set: { price: 0 } });
        await Order.create(orderData);
        await gateway.transaction.sale({
            amount: orderData.totalprice,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        }).then((result) => {
            return result;
        }).catch(async (err) => {
            await Order.findByIdAndUpdate(orderData._id, { status: 'cancelled' }).exec();
            customError(err.toString(), 500);
        });
    } catch (error) {
        // if an error occures the created order should not be completed
        customError(error.toString(), 500);
    }
};

const getOrders = async (page, limit) => {

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
    }

    try {
        return await Order.paginate({}, options);
    } catch (error) {
        customError(error.toString(), 500);
    }
}

const getOrder = async (orderId, userId) => {
    try {
        const order = await Order.aggregate([
            { $match: { $and: [{ _id: mongoose.Types.ObjectId(orderId) }, { userId: mongoose.Types.ObjectId(userId) }] } },
            {
                $lookup: {
                    from: "orderItems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems"
                }
            }
        ]);
        if (order.length === 0) customError("ORDER_NOT_FOUND", 404);
        return order;
    } catch (error) {
        customError(error.toString(), 500);
    }
}

const getVendorOrdersItems = async (vendor, page, limit) => {
    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        populate: ["productId",
            {
                path: "orderId",
                select: "status -_id"
            }]
    }

    const store = await Store.findOne({ userId: vendor._id });
    if (!store) customError("STORE_NOT_FOUND", 404);

    try {
        return await OrderItem.paginate({ vendorId: store._id }, options);
    } catch (error) {
        customError(error.toString(), 500);
    }
}

// cancelling order if the status is 'processing' or 'processing' 
const cancel = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) customError("ORDER_NOT_FOUND", 404);

    try {
        if (order.status === 'processing' || order.status === 'preparing') {
            // re-increase the products quantities
            const orderItems = await OrderItem.find({ orderId: order._id });
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.quantity } });
            }
            // change the status of the order to 'cancelled' 
            return await Order.findByIdAndUpdate(order._id, { status: 'cancelled' }, { new: true });
        }
        return order;
    } catch (error) {
        customError(error.toString(), 500);
    }
}

// admin can change the status of an order
const changeStatus = async (orderId, orderStatus) => {
    const order = await Order.findById(orderId);
    isEmpty(orderStatus);
    const status = ['processing', 'preparing', 'shipping', 'cancelled', 'pickedup'];

    if ((status.findIndex(item => item == orderStatus.status) === -1))
        customError("UNPROCESSABLE_ENTITY", 422);

    if (!orderStatus.status) customError("STATUS_NOT_PROVIDED", 400);

    if (!order) customError("ORDER_NOT_FOUND", 404);

    try {
        return await Order.findByIdAndUpdate(orderId, orderStatus, { new: true });
    } catch (error) {
        customError(error.toString(), 500);
    }
}


module.exports = {
    getPaymentToken,
    createOrder,
    getOrders,
    getOrder,
    getVendorOrdersItems,
    cancel,
    changeStatus
}