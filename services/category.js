const Category = require('../models/catogry');
const User = require('../models/user');
const Subcategory = require('../models/subcategory');
const customError = require('../functions/errorHandler');


const loggedUserCheck = async (userId) => {
    const loggedUser = await User.findById(userId);
    if(!loggedUser) customError("UNAUTHORIZED_NOTLOGGEDIN", 401);
    if(loggedUser.role !== "admin") customError("UNAUTHORIZED", 401);
}

const categoryExisitsCheck = async (categoryId) => {
    if(!(await Category.findById(categoryId))) customError("CATEGORY_NOTFOUND", 404);
}

const subcategoryExisitsCheck = async (subcategoryId, categoryId) => {
    const subcategory = await Subcategory.findById(subcategoryId);
    if(!subcategory) customError("SUBCATEGORY_NOTFOUND", 404);
    if(subcategory.categoryId !== categoryId) customError("SUBCATEGORY_NOTFOUND", 404);
}

const retrieveAllCategories = async () => {
    try{
        return await Category.find();
    } catch(error) {
        return customError(error.toString(), 500);
    }
}

const createCategory = async (category, userId) => {
    await loggedUserCheck (userId);

    try{
        const newCategory = new Category(category);
        await newCategory.save();
        return newCategory; 
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
        return await Subcategory.find({ categoryId: categoryId }).exec();
    } catch(error){
        return customError(error);
    }
}

const createSubcategory = async (subcategory, categoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    await categoryExisitsCheck(categoryId);

    try{
        subcategory.categoryId = categoryId;
        const newSubcategory = new Subcategory(subcategory);
        await newSubcategory.save();
        return newSubcategory; 
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



module.exports = {
    retrieveAllCategories,
    createCategory,
    editCategory,
    retrieveSubcategoriesOfCategory,
    createSubcategory,
    editSubcategory
}