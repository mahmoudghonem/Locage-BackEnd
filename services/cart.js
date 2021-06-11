const CustomError = require('../functions/errorHandler');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');


//Check if user Loggined and get Id
const loggenedUser = async (id) => {
    const userId = await User.findOne({ _id: id }).exec();
    if (!userId)
        new CustomError('UNAUTHORIZED', 401);
    return userId;
};
 
//Check if product found in cart 
const checkIfProductAlreadyIn = async (cartId, productId) => {
    return await CartItem.findOne({ cartId: cartId, productId: productId }).exec();
};

//calculate cart price
const calPrice = async (id)=>{
    var total = 0 ;
    const cartItems =  await CartItem.find({ cartId: id});
    for(const item of cartItems ){
         total += item.price ;
    }
    await Cart.findByIdAndUpdate(id , {$set:{totalprice: total }});
   };


//get All items in cart
const getUserCart = async (req, res) => {
    const userId = req.userId;

    await loggenedUser(userId);
    const cart = await Cart.findOne({ userId: userId }).exec();

    await CartItem.find({ cartId: cart._id }).then((result) => {  
                          
        return res.status(200).json({ result: result , cart });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//get item Details 
const cartDetail = async (req, res) => {
    const userId = req.userId;

    await loggenedUser(userId);

    const cart = await Cart.findOne({ userId: userId }).exec();

    const cartItems = await CartItem.find({ cartId: cart._id }).distinct('productId').exec();
  
    await Product.find({ _id: { $in: cartItems } }).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//add item to cart
const addCart = async (req, res) => {
    const { body } = req ;
    const { productId } = req.params;
    const userId = req.userId;

    await loggenedUser(userId);

    const product = await Product.findById(productId).exec();
    const cart = await Cart.findOne({ userId: userId }).exec();

    if (!product){
        new CustomError('PRODUCT_NOT_FOUND', 404);
    }


    const fondedItem = await checkIfProductAlreadyIn(cart._id, product._id);

    if (fondedItem){
        return res.status(200).json({ message: "PRODUCT_ALREADY_ADDED" });
    }
    if(Object.keys(req.body).length === 0){
        return res.status(200).json({ message: "NOTHING_UPDATE" });
    }

    var totalPrice = 0 ;
    totalPrice = product.price * body.quantity;

    const cartItem = new CartItem({ ...body , price :totalPrice , cartId: cart._id,  productId: product._id});
    //await Product.findByIdAndUpdate(product._id,{$inc: {quantity:-1 }});

    await cartItem.save(cartItem).then(() => {
        calPrice(cart._id);
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//update item in cart 
const updateCart = async (req, res) => {
    const {body} = req ;
    const { productId } = req.params;
    const userId = req.userId;

    await loggenedUser(userId);

    const product = await Product.findById(productId).exec();
    const cart = await Cart.findOne({ userId: userId }).exec();

    if (!product){
        new CustomError('PRODUCT_NOT_FOUND', 404);
    }

    const fondedItem = await checkIfProductAlreadyIn(cart._id, product._id);

    if (!fondedItem){
        return res.status(200).json({ message: "ITEM_NOT_FOUND" });
    }
    if(Object.keys(req.body).length === 0){
        return res.status(200).json({ message: "NOTHING_UPDATE" });
    }

    var totalPrice = 0 ;
    totalPrice = product.price * body.quantity;

    await CartItem.findByIdAndUpdate(fondedItem ,{$set:{price :totalPrice , quantity : body.quantity} })
    .then(() => {
        calPrice(cart._id);
        return res.status(200).json({ message: "UPDATED_SUCCESSFULLY"});
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//delete one item in cart
const removeCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.userId;

    await loggenedUser(userId);
    const cart = await Cart.findOne({ userId: userId }).exec();

    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

    const fondedItem = await checkIfProductAlreadyIn(cart._id, productId);
    if (!fondedItem)
        new CustomError('WISH_LIST_ITEM_NOT_FOUND', 400);
    await CartItem.findOneAndRemove({ cartId: cart._id, productId: productId }).then((result) => {
        calPrice(cart._id);
        return res.status(200).json({ message: "REMOVED_SUCCESSFULLY", result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//delete all item in cart 
const emptyCart = async (req, res) => {
    const userId = req.userId;

    await loggenedUser(userId);
    const cart = await Cart.findOne({ userId: userId }).exec();
     
    await CartItem.deleteMany({ cartId: cart._id }).then(() => {
        calPrice(cart._id);
        return res.status(200).json({ message: "REMOVED_ALL_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};


module.exports = {
    getUserCart ,
    cartDetail ,
    addCart ,
    updateCart,
    removeCart ,
    emptyCart
};