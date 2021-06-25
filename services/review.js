const Review = require("../models/review");
const User = require("../models/user")
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require('../models/product');
const CustomError = require("../functions/errorHandler");

//Check if loggined User
const logginedUser = async (id)=>{
   const userId = await User.findOne({_id : id}).exec();
   if(!userId)
       new CustomError("UNAUTHORIZED" , 401);
    return userId;
};
//Check if You order this product 
const checkIfProductAlreadyIn = async (orderId, productId) => {
    return await OrderItem.findOne({ orderId: orderId, productId: productId }).exec();
};

const updateProductRatng = async (productId)=>{
    var total = 0 ;
    var count = 0 ;
    const reviews =  await Review.find({ productId: productId});
    for(const item of reviews ){
         total += item.rate ;
         count ++ ;
    }
    console.log(count);
    total = total/count ;
     await Product.findByIdAndUpdate(productId , {$set:{rating: total }});
}

//Get Product not contain revew
const getProductsNotReview = async (req, res) => {
    const { limit } = req.query;
    const { page } = req.query;
    const userId = req.userId;

    await logginedUser(userId);
 
     const options = {
        limit: limit || 10,
        page: page || 1, 
    };

    const order = await Order.findOne({ userId: userId }).exec();
     if(order.status != "pickedup")
        return res.status(200).json({ message: "NOT_FOUND_PRODUCTS" });

    const orderItem = await OrderItem.find({ orderId: order }).distinct('productId').exec();

    const review = await Review.find({ userId: userId }).distinct('productId').exec();
  
  await Product.paginate({ _id: { $in: orderItem , $nin:review} }, options).then((result)=>{
      return res.status(200).json({result:result});
    }).catch((err)=>{
        new CustomError(err.toString());
    });
};

// Get reviews of product 
const getReviews = async (req, res) => {
    const {productId} = req.params ;
    const { limit } = req.query;
    const { page } = req.query;
    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

     const options = {
        limit: limit || 10,
        page: page || 1, 
    };
  
  await Review.paginate({ productId: product._id }, options).then((result)=>{
      return res.status(200).json({result:result});
    }).catch((err)=>{
        new CustomError(err.toString());
    });
};

const addReview = async (req, res) => {
    const { body } = req ;
    const { productId } = req.params;
    const userId = req.userId;

    await logginedUser(userId);

    const product = await Product.findById(productId).exec();
    const order = await Order.findOne({ userId: userId }).exec();

    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

    if(order.status != "pickedup")
        return res.status(200).json({ message: "CAN`T_WRITE_REVIEW" });

    const fondedItem = await checkIfProductAlreadyIn(order._id, product._id);

    if (!fondedItem)
        return res.status(200).json({ message: "PRODUCT_NOT_FOUND_IN_ORDER" });
    

    const review = new Review({ ...body , userId : userId ,  productId : product._id });

    await review.save(review).then(( result ) => {
        updateProductRatng(product._id );
        return res.status(200).json({ message: "REVIEW_ADDED_SUCCESSFULLY" , result:result  });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const updateRev = async (req, res) => {
    const {body} = req ;
    const { id } = req.params;
    const userId = req.userId;

    await logginedUser(userId);
    const review = await Review.findOne({ userId: userId , _id : id }).exec();
    if (!review){
        return res.status(200).json({ message: "ITEM_NOT_FOUND" });
    }

    const product = await Product.findById(review.productId).exec();

    if (!product){
        new CustomError('PRODUCT_NOT_FOUND', 404);
    }

    if(Object.keys(req.body).length === 0){
        return res.status(200).json({ message: "NOTHING_UPDATE" });
    }



    await Review.findByIdAndUpdate(review._id ,{...body} )
    .then(() => {
        updateProductRatng(product._id );

        return res.status(200).json({ message: "UPDATED_SUCCESSFULLY"});
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

//delete you review 
const removeReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    await logginedUser(userId);
    const review = await Review.findOne({ userId: userId  , _id : id }).exec();

    const product = await Product.findById( review.productId ).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);
    if (!review)
        new CustomError('REVIEW_ITEM_NOT_FOUND', 400);
    await Review.findByIdAndRemove(review._id).then((result) => {
        updateProductRatng(product._id );
        return res.status(200).json({ message: "REMOVED_SUCCESSFULLY", result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};






module.exports = {
    getProductsNotReview ,
    getReviews ,
    addReview ,
    updateRev , 
    removeReview,
}