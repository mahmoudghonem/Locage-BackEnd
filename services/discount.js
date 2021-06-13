const customError = require('../functions/errorHandler');
const Discount = require('../models/discount');
const { isEmpty } = require('../functions/checks');


const getDiscountCodes = async (page, limit) => {
    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
    }

    try{
        const discounts = await Discount.paginate({}, options);
        if(!discounts) customError("DISCOUNTS_NOT_FOUND", 404);
        return discounts;
    } catch(error){
        customError(error.toString(), 500);
    }
}

const createDiscount = async (discountData) => {
    isEmpty(discountData);

    try{
        return await Discount.create(discountData);
    } catch(error){
        customError(error.toString(), 500);
    }
}

const editDiscount = async (discountData, discountCodeId) => {
    isEmpty(discountData);

    try{
        return await Discount.findByIdAndUpdate(discountCodeId, discountData, { new: true });
    } catch(error){
        customError(error.toString(), 500);
    }
}

const deleteDiscount = async (discountCodeId) => {
    const discountCode = await Discount.findById(discountCodeId);

    if(!discountCode) customError("DISCOUNTCODE_NOT_FOUND", 404);

    try{
        return await Discount.findByIdAndDelete(discountCodeId);
    } catch(error){
        customError(error.toString(), 500);
    }
}




module.exports = {
    getDiscountCodes,
    createDiscount,
    editDiscount,
    deleteDiscount
}
