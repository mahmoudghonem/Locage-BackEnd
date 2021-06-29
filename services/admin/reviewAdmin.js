const Review = require("../../models/review");
const Store = require("../../models/store")
// const Order = require("../models/order");
// const OrderItem = require("../models/orderItem");
const Product = require('../../models/product');
const CustomError = require("../../functions/errorHandler");

// Get reviews of product 
const getProductReviews = async (req, res) => {
    const {productId} = req.params ;
    const { limit } = req.query;
    const { page } = req.query;
    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

     const options = {
        limit: limit || 10,
        page: page || 1, 
        populate:{
            path: "userId"
               },
    };
  
  await Review.paginate({ productId: product._id }, options).then((result)=>{
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
        page: parseInt(page) || 1,
        populate:{
            path: "userId"
               },
    }

    var revArr = [];
    const VENDOR = await Store.findById(_id).exec();
    if(!VENDOR)
      new CustomError("VENDORE_NOT_FOUND","404",);
    const products = await Product.find({vendorId: VENDOR._id});
    if(!products)
       new CustomError("PRODUCT_NOT_FOUND","404");
       try {
           for(const key of products){
           const review = await Review.paginate({ productId: key._id }, options);
           if(review)
              revArr.push("Product", key ,"Reviews",review.docs);
            
           }
     return res.status(200).json({VENDOR,result : revArr});
    } catch (error) {
        CustomError(error.toString());
    }
}

module.exports = {

    getProductReviews ,
    getVendorReviews
}