/* eslint-disable no-undef */
const customError = require('../../functions/errorHandler');
const Product = require('../../models/product');

const Store = require('../../models/store');
const { checkId} = require('../../functions/checks');
const cloudinary = require("../../functions/cloudinary");
// check the vendor's store Id is the same in product
function storeIdMatch (store, product) {
    if(!store._id.equals(product.vendorId)) customError("ACCESS_DENIED", 401);
}

// check that vendor has created a store
function vendorHasStore(store) {
    if (!store) customError("STORE_NOT_FOUND", 404);
}

// product exists check
function productExists(product) {
    if (!product) customError("PRODUCT_NOT_FOUND", 404);
}

const getProducts = async (req) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
        limit: limit,
        page: page
    }
    try {
        return await Product.paginate({}, options);
    } catch (error) {
        return customError(error.toString(), 500);
    }
}

const getVendorProducts = async (userId, page, limit) => {

    const store = await Store.findOne({ userId: userId });
    vendorHasStore(store);

    try {
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        }
        return await Product.paginate({ vendorId: store._id }, options);
    } catch (error) {
        customError(error.toString(), 500);
    }
}

const getProduct = async (id) => {
    checkId(id);

    try {
        const product = await Product.findById(id);
        productExists(product);
        return product;
    } catch (error) {
        return customError(error.toString(), 500);
    }
}

const getTopDeals = async (page, limit) => {
    try {
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        }
        return await Product.paginate({ $or: [{ discount: { $gt: 10 } }, { quantity: { $lt: 10 }}] }, options);
    } catch (error) {
        customError(error.toString(), 500);
    }
}

const getTodayDeals = async (page, limit) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(today.toISOString());
    console.log(tomorrow.toISOString());
    try {
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        }
        return await Product.paginate({ $and: [{ 'discountDate.start': { $gte: today.toISOString().split('T')[0] }},
        { 'discountDate.start': { $lt: tomorrow.toISOString().split('T')[0] }} ] }, options);
    } catch (error) {
        customError(error.toString(), 500);
    }
}

const searchProducts = async (key) => {
    try{
        const options = {
            page: 1,
            limit: 10
        }
        return Product.paginate({ $or: [{ brand: new RegExp(key, 'i') }, { title: new RegExp(key, 'i') }] }, options);
    } catch(error){
        customError(error.toString(), 500);
    }
}


const remove = async (id, userId) => {
    // check
    checkId(id);

    const productToDelete = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

   storeIdMatch(store, productToDelete);

    const { photosPublicId } = productToDelete;    
    try{
        photosPublicId.forEach(async(id) => await cloudinary.uploader.destroy(id));


        return await Product.findByIdAndDelete(id);
    } catch (error) {
        return customError(error.toString(), 500);
    }
}

module.exports = {
    getProducts,
    getVendorProducts,
    getProduct,
    remove,
    getTopDeals,
    getTodayDeals,
    searchProducts
};