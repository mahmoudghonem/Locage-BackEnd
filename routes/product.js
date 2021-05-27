const express = require('express');
const router = express.Router();
const { add, getProducts, getProduct, edit, remove } = require('../services/product');
const upload = require('../middlewares/multipleImageUpload');
//const { validate, addValidationRules } = require('../middlewares/productValidator');
const authjwt = require("../middlewares/authjwt");


// Product Routes
router.get('/', retrieveProducts);
router.get('/:id', retrieveProduct);
router.post('/add', authjwt, /*addValidationRules(), validate,*/ upload, addProduct);
router.patch('/edit/:id', authjwt, editProduct);
router.delete('/delete/:id', authjwt, deleteProduct);


/* Routes Handlers */
// Retrieve all products
function retrieveProducts(req, res, next){
    getProducts(req, res).then(result => res.json(result))
    .catch(error => next(error))
}

// Retrieve a product by id
function retrieveProduct(req, res, next){
    const { id } = req.params;
    getProduct(id).then(result => res.json(result))
    .catch(error => next(error))
}

// Add a new product
function addProduct(req, res, next){
    const { body, files, userId } = req;
    add(body, files, userId).then(result => res.json({message: "Product has been added.", result: result}))
    .catch(error => next(error));
}

// Modify an existing product 
function editProduct(req, res, next){
    const { body } = req;
    const { id } = req.params;
    edit(body, id).then(result => res.json({message: "Product has been edited.", result: result}))
    .catch(error => next(error));
}

// Remove a product 
function deleteProduct(req, res, next){
    const { id } = req.params;
    remove(id).then(result => res.json({message: "Product has been deleted", result: result}))
    .catch(error => next(error));
}

module.exports = router;