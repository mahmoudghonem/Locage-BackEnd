const Review = require("../../models/review");
const Store = require("../../models/store")
// const Order = require("../models/order");
// const OrderItem = require("../models/orderItem");
const Product = require('../../models/product');
const CustomError = require("../../functions/errorHandler");

// Get reviews of product 
const getProductReviews = async (req, res) => {
    const productId = req.params ;
    await Review.find(productId).limit(10).then((result)=>{
        return res.status(200).json({result:result});
    }).catch((err)=>{
        new CustomError(err.toString());
    });
};


// Get reviews of Vendor  
const getVendorReviews = async (req , res) => {
    const _id = req.params ;
    const { limit } = req.query;
    const { page } = req.query;

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
    }

    var revArr = [];
    const VENDORE = await Store.findById(_id).exec();
    if(!VENDORE)
      new CustomError("404","VENDORE_NOT_FOUND");
    const products = await Product.find({vendorId: VENDORE._id});
    if(!products)
       new CustomError("404","PRODUCT_NOT_FOUND");
       try {
           for(const key of products){
           const review = await Review.paginate({ productId: key._id }, options);
           if(review)
              revArr.push( key._id ,review.docs);
           }
     return res.status(200).json({result : revArr});
    } catch (error) {
        CustomError(error.toString());
    }
}

module.exports = {

    getProductReviews ,
    getVendorReviews
}