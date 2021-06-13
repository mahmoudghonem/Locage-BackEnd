const Category = require('../models/catogry');
const User = require('../models/user');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const customError = require('../functions/errorHandler');
const cloudinary = require("../functions/cloudinary");


const loggedUserCheck = async (userId) => {
    const loggedUser = await User.findById(userId);
    if(!loggedUser) customError("UNAUTHORIZED", 401);
    if(loggedUser.role !== "admin") customError("UNAUTHORIZED", 401);
}

const categoryExisitsCheck = async (categoryId) => {
    if(!(await Category.findById(categoryId))) customError("CATEGORY_NOT_FOUND", 404);
}

const subcategoryExisitsCheck = async (subcategoryId, categoryId) => {
    const subcategory = await Subcategory.findById(subcategoryId);
    if(!subcategory) customError("SUBCATEGORY_NOT_FOUND", 404);
    if(subcategory.categoryId !== categoryId) customError("SUBCATEGORY_NOT_FOUND", 404);
}

const retrieveAllCategories = async () => {
    try{
        return await Category.find();
    } catch(error) {
        return customError(error.toString(), 500);
    }
}

const createCategory = async (category, userId, photo) => {
    await loggedUserCheck (userId);

    try{
        const result = await cloudinary.uploader.upload(photo.path);
        const newCategory = new Category({ ...category, photo: result.secure_url, photoPublicId: result.public_id });
        return await Category.create(newCategory); 
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const editCategory = async (editedCategory, categoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    await categoryExisitsCheck(categoryId);

    try{
        return await Category.findByIdAndUpdate(categoryId, editedCategory);
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const retrieveSubcategoriesOfCategory = async (categoryId) => {
    await categoryExisitsCheck(categoryId);

    try{
        return await Subcategory.find({ categoryId: categoryId }).populate('categoryId').exec();
    } catch(error){
        return customError(error);
    }
}

const createSubcategory = async (subcategory, categoryId, userId, photo) => {
    // checks
    await loggedUserCheck (userId);
    await categoryExisitsCheck(categoryId);

    try{
        const result = await cloudinary.uploader.upload(photo.path);
        subcategory.categoryId = categoryId;
        const newSubcategory = new Subcategory({ ...subcategory, photo: result.secure_url, photoPublicId: result.public_id });
        return await Subcategory.create(newSubcategory);
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const editSubcategory = async (editedSubcategory, subcategoryId, categoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    await categoryExisitsCheck(categoryId);
    await subcategoryExisitsCheck(subcategoryId, categoryId);

    try{
        return await Subcategory.findByIdAndUpdate(subcategoryId, editedSubcategory);
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const getProductsOfCategory = async (categoryId, page, limit) => {
    // check
    await categoryExisitsCheck(categoryId);

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    }
    try{
        const subcategories = await Subcategory.find({ categoryId: categoryId });
        const result = await Product.paginate({ subcategoryId: { $in: subcategories } }, options);
        if(result.docs.length === 0) customError("NO_PRODUCTS_AVAILABLE", 404);
        return result;
    } catch(error){
        return customError(error);
    }
}

const deleteCategory = async (categoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    await categoryExisitsCheck(categoryId);

    try{
        // delete related subcategories and products
        const subcategories = await Subcategory.find({ categoryId: categoryId });

        await Product.deleteMany({ subcategoryId: { $in: subcategories } });

        await Subcategory.deleteMany({ categoryId: categoryId });

        return await Category.findByIdAndDelete(categoryId);
    } catch(error){
        return customError(error.toString(), 500);
    }
}



module.exports = {
    retrieveAllCategories,
    createCategory,
    editCategory,
    retrieveSubcategoriesOfCategory,
    createSubcategory,
    editSubcategory,
    getProductsOfCategory,
    deleteCategory
}