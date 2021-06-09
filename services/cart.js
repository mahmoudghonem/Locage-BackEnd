const CustomError = require('../functions/errorHandler');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');


const loggenedUser = async (id) => {
    const userId = await User.findOne({ _id: id }).exec();
    if (!userId)
        new CustomError('UNAUTHORIZED', 401);
    return userId;
};

const checkIfProductAlreadyIn = async (cartId, productId) => {
    return await CartItem.findOne({ cartId: cartId, productId: productId }).exec();
};


// const getUserCart = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.userId;
//     if (userId != id)
//         new CustomError('UNAUTHORIZED', 401);

//     await loggenedUser(userId);
//     const cart = await Cart.findOne({ userId: userId }).exec();
//      //const cartItems = await CartItem.find({ cartId: cart._id });
//     await CartItem.find({ cartId: cart._id }).then((result) => {               
//         return res.status(200).json({ result: result });
//     }).catch((err) => {
//         new CustomError(err.toString());
//     });

// };

const cartDetail = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await loggenedUser(userId);
    const cart = await Cart.findOne({ userId: userId }).exec();

    const cartItems = await CartItem.find({ cartId: cart._id }).distinct('productId').exec();

    await Product.find({ _id: { $in: cartItems } }).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const addCart = async (req, res) => {
    const { id, productId } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await loggenedUser(userId);

    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

    const cart = await Cart.findOne({ userId: userId }).exec();

    // const body = {
    //     cartId: cart._id,
    //     productId: product._id
    // };

    const fondedItem = await checkIfProductAlreadyIn(cart._id, product._id);
    var totalPrices=0 ;

    if (fondedItem){
        console.log(fondedItem);
        const update =  {$inc: {quantity:1 }} ;
        console.log(update);
        const cartIte = await CartItem.findByIdAndUpdate(fondedItem._id,{$inc: {quantity:1 }});
        await Product.findByIdAndUpdate(product._id,{$inc: {quantity:-1 }});

        console.log(cartIte.price);
        console.log(cartIte.quantity);
        console.log(totalPrices)
        totalPrices += (cartIte.price * (cartIte.quantity+1));
        console.log(totalPrices)
        await Cart.findByIdAndUpdate(cart._id , {totalPrices : cart.totalprice})
        return res.status(200).json({ message: "INCREASE_QUANTITY_SUCCESSFULLY" });
    }
       
    const cartItem = new CartItem({ price : product.price , cartId: cart._id,  productId: product._id});
    await Product.findByIdAndUpdate(product._id,{$inc: {quantity:-1 }});

        for( var j = 0 ; j<cartItem.length ; j++ ){
            totalPrices += cartItem[j].price * cartItem[j].quantity;            
        }
        //cart.totalPrice = cartPrice;
        const cartPrice = new Cart({totalPrices : cart.totalprice});
       await cart.save(cartPrice).then(() => {
        return res.status(200).json({ message: "ADDED_PRICE" });
    }).catch((err) => {
        new CustomError(err.toString());
    });
    await cartItem.save(cartItem).then(() => {
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

// const removeCart = async (req, res) => {
//     const { id, productId } = req.params;
//     const userId = req.userId;
//     if (userId != id)
//         new CustomError('BAD_REQUEST', 400);

//     await loggenedUser(userId);
//     const cart = await Cart.findOne({ userId: userId }).exec();

//     const product = await Product.findById(productId).exec();
//     if (!product)
//         new CustomError('PRODUCT_NOT_FOUND', 404);

//     const fondedItem = await checkIfProductAlreadyIn(cart._id, productId);
//     if (!fondedItem)
//         new CustomError('WISH_LIST_ITEM_NOT_FOUND', 400);

//     await CartItem.findOneAndRemove({ cartId: cart._id, productId: productId }).then((result) => {
//         return res.status(200).json({ message: "REMOVED_SUCCESSFULLY", result: result });
//     }).catch((err) => {
//         new CustomError(err.toString());
//     });

// };

// const emptyCart = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.userId;
//     if (userId != id)
//         new CustomError('BAD_REQUEST', 400);

//     await loggenedUser(userId);
//     const cart = await Cart.findOne({ userId: userId }).exec();

//     await CartItem.deleteMany({ cartId: cart._id }).then(() => {
//         return res.status(200).json({ message: "REMOVED_ALL_SUCCESSFULLY" });
//     }).catch((err) => {
//         new CustomError(err.toString());
//     });

// };


module.exports = {
    //getUserCart ,
    cartDetail ,
    addCart ,
   // removeCart ,
   // emptyCart
};