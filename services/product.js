const customError = require('../functions/errorHandler');
const Product = require('../models/product');


// Check that id is correct and castable
const checkId = (id) => {
    if(id.length > 24 || id.length < 24) customError("UNCASTABLE_OBJECTID", 400)
}

// Check that the body of the request is not empty
const isEmpty = (obj) => {
    if(Object.keys(obj).length === 0 && obj.constructor === Object) customError("BAD_REQUEST", 400);
}

const getProducts = async (req) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
        limit: limit,
        page: page
    }
    return await Product.paginate({}, options);
}

const getProduct = async (id) => {
    checkId(id);
    return await Product.findById(id);
}

const add = async (product, files) => {
    // check
    const existingProduct = await Product.findOne({ title: product.title })
    if(existingProduct) customError("TITLE_MUST_BE_UNIQUE", 400);

    const photos = [];
    isEmpty(product);
    if(files.length !== 0)
        files.forEach(file => photos.push(file.filename));
    const newProduct = new Product({...product, photos: photos});
    return await newProduct.save();
}

const edit = async (editedData, id) => {
    // check 
    checkId(id);
    
    const productToEdit = await Product.findById(id);

    // check that product exists
    if(!productToEdit) customError("PRODUCT_NOT_FOUND", 404);

    // check that editedData is not empty
    isEmpty(editedData);

    return await Product.findByIdAndUpdate(id, editedData, {new: true});
}

const remove = async (id) => {
    checkId(id);
    const productToDelete = await Product.findById(id);
    if(!productToDelete) customError("PRODUCT_NOT_FOUND", 404);
    return await Product.findByIdAndDelete(id);
}

module.exports = {
    add,
    getProducts,
    getProduct,
    edit,
    remove
}