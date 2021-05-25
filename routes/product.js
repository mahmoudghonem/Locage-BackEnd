const express = require('express');
const router = express.Router();
const { add } = require('../services/product');

// Product Routes
router.get('/', retrieveProducts);
router.post('/add-product', addProduct);


/* Routes Handlers */
// Retrieve all products
function retrieveProducts(req, res){
    res.json("Here it comes..");
}

// Add a new product
function addProduct(req, res, next){
    add(req, res).then(result => res.json(result))
    .catch(error => next(error));
}

module.exports = router;