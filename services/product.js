/* eslint-disable no-undef */
const customError = require('../functions/errorHandler');
const Product = require('../models/product');
const User = require('../models/user');
const Store = require('../models/store');
const { checkId, isEmpty } = require('../functions/checks');
const cloudinary = require("../functions/cloudinary");

// check that user is logged-in
function userIsLoggedin(loggedUser) {
    if (!loggedUser) customError("UNAUTHORIZED", 401);
}

// check the role of the user logged-in is "vendor"
function roleIsVendor(loggedUser) {
    if (loggedUser.role != "vendor") customError("UNAUTHORIZED", 401);
}

// check the vendor's store Id is the same in product
function storeIdMatch (store, product) {
    if(!store._id.equals(product.vendorId)) customError("ACCESS_DENIED", 401);
}

// check that vendor has created a store
function vendorHasStore(store) {
    if (!store) customError("STORE_NOTFOUND", 404);
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
    const loggedUser = await User.findById(userId);
    userIsLoggedin(loggedUser);
    roleIsVendor(loggedUser);

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

const searchProducts = async (key, page, limit) => {
    try{
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            populate: {
                path: "subcategoryId",
                populate: {
                    path: "categoryId"
                }
            }
        }
        return Product.paginate({ $or: [{ brand: new RegExp(key, 'i') }, { title: new RegExp(key, 'i') },
            { description: new RegExp(key, 'i') }] }, options);
    } catch(error){
        customError(error.toString(), 500);
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

    try {
        const store = await Store.findOne({ userId: userId });
        vendorHasStore(store);
        const newProduct = new Product({ ...product, photos: photos, photosPublicId: photosPublicId, vendorId: store._id });
        return await newProduct.save();
    } catch (error) {
        return customError(error.toString(), 500);
    }
}


const edit = async (editedData, id, userId) => {
    // check 
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToEdit = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin(loggedUser);
    roleIsVendor(loggedUser);
    productExists(productToEdit);
    storeIdMatch(store, productToEdit);

    // check that editedData is not empty
    isEmpty(editedData);

    try{
        return await Product.findByIdAndUpdate(id, editedData, {new: true});
    } catch(error) {
        return customError(error.toString(), 500);
    } 
}

const pushPhotos = async (id, files, userId) => {
    // check 
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToEdit = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin (loggedUser);
    roleIsVendor(loggedUser);
    productExists(productToEdit);
    storeIdMatch(store, productToEdit);

    try{
        const photos = productToEdit.photos;
        const photosPublicId = productToEdit.photosPublicId;
        if(files.length !== 0){
            if((files.length + productToEdit.photos.length) > 10) 
                customError("MAX_10_PHOTOS_ALLOWED", 400);

            for(const file of files){
                const { path } = file;
                const result = await cloudinary.uploader.upload(path);
                photos.push(result.secure_url);
                photosPublicId.push(result.public_id);
            }
        }
        return await Product.findByIdAndUpdate(id, {...productToEdit, photos: photos, photosPublicId: photosPublicId}, {new: true});
    } catch(error){
        customError(error.toString(), 500);
    }
}

const deletePhoto = async (id, photoName, userId) => {
    // check 
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToEdit = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin (loggedUser);
    roleIsVendor(loggedUser);
    productExists(productToEdit);
    storeIdMatch(store, productToEdit);

    try{
        const indexOfPhoto = productToEdit.photos.findIndex(elem => elem == photoName);
        if(indexOfPhoto === -1) customError("PHOTO_NOT_FOUND", 404);
        await cloudinary.uploader.destroy(productToEdit.photosPublicId[indexOfPhoto]);
        productToEdit.photos.splice(indexOfPhoto, 1);
        productToEdit.photosPublicId.splice(indexOfPhoto, 1);
        return await Product.findByIdAndUpdate(id, productToEdit, {new: true});
    } catch(error){
        customError(error.toString(), 500);
    }
}

const remove = async (id, userId) => {
    // check
    checkId(id);

    const loggedUser = await User.findById(userId);
    const productToDelete = await Product.findById(id);
    const store = await Store.findOne({ userId: userId });

    userIsLoggedin(loggedUser);
    roleIsVendor(loggedUser);
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
    add,
    getProducts,
    getVendorProducts,
    getProduct,
    edit,
    pushPhotos,
    deletePhoto,
    remove,
    getTopDeals,
    getTodayDeals,
    searchProducts
};