const Category = require('../models/catogry');
const User = require('../models/user');
//const Subcategory = require('../models/subcategory');
const customError = require('../functions/errorHandler');


const loggedUserCheck = async (userId) => {
    const loggedUser = await User.findById(userId);
    if(!loggedUser) customError("UNAUTHORIZED", 401);
    if(loggedUser.role !== "admin") customError("UNAUTHORIZED", 401);
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




module.exports = {
    retrieveAllCategories,
    createCategory,
    //createSubcategory
}