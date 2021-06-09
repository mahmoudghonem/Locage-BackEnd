const customError = require('../functions/errorHandler');
const Product = require('../models/product');
const User = require('../models/user');
const Store = require('../models/store');
const { checkId, isEmpty } = require('../functions/checks');
const cloudinary = require("../functions/cloudinary");
const mongoose = require('mongoose');

// check that user is logged-in
function userIsLoggedin (loggedUser) {
    if (!loggedUser) customError("UNAUTHORIZED", 401);
}

// check the role of the user logged-in is "vendor"
function roleIsVendor (loggedUser){
    if (loggedUser.role != "vendor") customError("UNAUTHORIZED", 401);
}

// check the vendor's store Id is the same in product
function storeIdMatch (store, product) {
    if(mongoose.Schema.Types.ObjectId(store._id) != mongoose.Schema.Types.ObjectId(product.vendorId)) 
        customError("ACCESS_DENIED", 401);
}

// check that vendor has created a store
function vendorHasStore (store) {
    if(!store) customError("STORE_NOTFOUND", 404);
}

// product exists check
function productExists (product){
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
    try{
        return await Product.paginate({}, options);
    } catch(error) {
        return customError(error.toString(), 500);
    }
}

const getVendorProducts = async (userId, page, limit) => {
    const loggedUser = await User.findById(userId);
    userIsLoggedin (loggedUser);
    roleIsVendor(loggedUser);

    const store = await Store.findOne({ userId: userId });
    vendorHasStore(store);

    try{
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        }
        return await Product.paginate({ vendorId: store._id }, options);
    } catch(error){
        customError(error.toString(), 500);
    }
}

const getProduct = async (id) => {
    checkId(id);

    try{
        const product = await Product.findById(id);
        productExists(product);
        return product;
    } catch(error) {
        return customError(error.toString(), 500);
    }
    
}

const add = async (product, files, userId) => {
    // check
    const loggedUser = await User.findById(userId);

    userIsLoggedin(loggedUser);
    roleIsVendor(loggedUser);

    const photos = [];
    const photosPublicId = [];
    if (files.length !== 0) {
        for (const file of files) {
            const { path } = file;
            const result = await cloudinary.uploader.upload(path);
            photos.push(result.secure_url);
            photosPublicId.push(result.public_id);
        }
    }

    isEmpty(product);

    try{
        const store = await Store.findOne({ userId: userId });
        vendorHasStore (store);
        const newProduct = new Product({...product, photos: photos, photosPublicId: photosPublicId, vendorId: store._id});
        return await newProduct.save();
    } catch(error) {
        return customError(error.toString(), 500);
    }  
}


const edit = async (editedData, id, files, userId) => {
    // check 
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToEdit = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin (loggedUser);
    roleIsVendor(loggedUser);
    productExists(productToEdit);
    storeIdMatch(store, productToEdit);

    // check that editedData is not empty
    isEmpty(editedData);

    try{
        const photos = productToEdit.photos;
        const photosPublicId = productToEdit.photosPublicId;
        if(files.length !== 0){
            for(const file of files){
                const { path } = file;
                const result = await cloudinary.uploader.upload(path);
                photos.push(result.secure_url);
                photosPublicId.push(result.public_id);
            }
        }
        return await Product.findByIdAndUpdate(id, {...editedData, photos: photos, photosPublicId: photosPublicId}, {new: true});
    } catch(error) {
        return customError(error.toString(), 500);
    } 
}

const remove = async (id, userId) => {
    // check
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToDelete = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin (loggedUser);
    roleIsVendor(loggedUser);
    storeIdMatch(store, productToDelete);

    const { photosPublicId } = productToDelete;
    
    try{
        photosPublicId.forEach(async(id) => await cloudinary.uploader.destroy(id, function(result) { console.log(result) }));

        return await Product.findByIdAndDelete(id);
    } catch(error) {
        return customError(error.toString(), 500);
    }  
}

module.exports = {
    add,
    getProducts,
    getVendorProducts,
    getProduct,
    edit,
    remove
};