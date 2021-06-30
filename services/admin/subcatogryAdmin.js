const Subcategory = require('../../models/subcategory');
const Product = require('../../models/product');
const User = require('../../models/user');
const customError = require('../../functions/errorHandler');
const cloudinary = require("../../functions/cloudinary");


const loggedUserCheck = async (userId) => {
    const loggedUser = await User.findById(userId);
    if(!loggedUser) customError("UNAUTHORIZED", 401);
    if(loggedUser.role !== "admin") customError("UNAUTHORIZED", 401);
}


const getProductsOfSubcategory = async (subcategoryId, page, limit) => {

    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    }

    if(!(await Subcategory.findById(subcategoryId))) customError("SUBCATEGORY_NOT_FOUND", 404);

    try{
        const result = await Product.paginate({ subcategoryId: subcategoryId }, options)
        if(result.docs.length === 0) customError("NO_PRODUCTS_AVAILABLE", 404);
        return result;
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const getSubcategories = () => {
    try{
        return Subcategory.find().populate("categoryId");
    } catch(error) {
        return customError(error.toString(), 500);
    }
}

const editSubcategory = async (editedSubcategory, subcategoryId, userId, photo) => {
    // checks
    await loggedUserCheck (userId);
    if(!(await Subcategory.findById(subcategoryId))) customError("SUBCATEGORY_NOT_FOUND", 404);
    const subcategory = await Subcategory.findById(subcategoryId);

    try{
        if(photo){
            await cloudinary.uploader.destroy(subcategory.photoPublicId);
            const result = await cloudinary.uploader.upload(photo.path);
            return await Subcategory.findByIdAndUpdate(subcategory, { ...editedSubcategory, photo: result.secure_url, photoPublicId: result.public_id }, { new: true });
        }
        return await Subcategory.findByIdAndUpdate(subcategoryId, editedSubcategory, { new: true });
    } catch(error){
        return customError(error.toString(), 500);
    }
}

const deleteSubcategory = async (subcategoryId, userId) => {
    // checks
    await loggedUserCheck (userId);
    const subcategory = await Subcategory.findById(subcategoryId);

    try{
        // delete products related to subcategory
        //await Product.deleteMany({ subcategoryId: subcategoryId });

        await cloudinary.uploader.destroy(subcategory.photoPublicId);
        return await Subcategory.findByIdAndDelete(subcategoryId);
    } catch(error){
        return customError(error.toString(), 500);
    }
}

module.exports = {
    getProductsOfSubcategory,
    editSubcategory,
    deleteSubcategory,
    getSubcategories
}