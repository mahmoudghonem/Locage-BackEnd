const customError = require('../functions/errorHandler');
const Discount = require('../models/discount');


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

module.exports = {
    getDiscountCodes,
}
