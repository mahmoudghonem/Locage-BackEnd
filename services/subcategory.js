const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const User = require('../models/user');
const customError = require('../functions/errorHandler');


const loggedUserCheck = async (userId) => {
    const loggedUser = await User.findById(userId);
    if(!loggedUser) customError("UNAUTHORIZED_NOTLOGGEDIN", 401);
    if(loggedUser.role !== "admin") customError("UNAUTHORIZED", 401);
}


const getProductsOfSubcategory = async (subcategoryId, page, limit) => {

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 30
    }

    if(!(await Subcategory.findById(subcategoryId))) customError("SUBCATEGORY_NOTFOUND", 404);

    try{
        const result = await Product.paginate({ subcategoryId: subcategoryId }, options)
        if(result.docs.length === 0) customError("NO_PRODUCTS_AVAILABLE", 404);
        return result;
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const editSubcategory = async (editedSubcategory, subcategoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    if(!(await Subcategory.findById(subcategoryId))) customError("SUBCATEGORY_NOTFOUND", 404);

    try{
        return await Subcategory.findByIdAndUpdate(subcategoryId, editedSubcategory, { new: true });
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const deleteSubcategory = async (subcategoryId, userId) => {
    // checks
    await loggedUserCheck (userId);

    try{
        // delete products related to subcategory
        await Product.deleteMany({ subcategoryId: subcategoryId });

        return await Subcategory.findByIdAndDelete(subcategoryId);
    } catch(error){
        return customError(error.toString(), 500);
    }
}

module.exports = {
    getProductsOfSubcategory,
    editSubcategory,
    deleteSubcategory
}