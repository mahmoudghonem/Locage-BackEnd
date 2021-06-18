/* eslint-disable no-undef */
const Order = require('../../models/order');
const OrderItem = require('../../models/orderItem');
const Product = require('../../models/product');
const Store = require('../../models/store');
const customError = require('../../functions/errorHandler');
const { isEmpty } = require('../../functions/checks');


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

const getVendorOrdersItems = async (vendor, page, limit) => {
    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
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
    const order = await Order.findOne({ _id: orderId });

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
    getOrders,
    getVendorOrdersItems,
    cancel,
    changeStatus
}