const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const customError = require('../functions/errorHandler');


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

module.exports = {
    getProductsOfSubcategory
}