const express = require('express');
const router = express.Router();
const {  getProducts, getVendorProducts, getProduct, getTodayDeals, 
    searchProducts, getTopDeals,  remove } = require('../../services/admin/productAdmin');
const authjwt = require("../../middlewares/authjwt");
const { adminRole } = require('../../middlewares/roles');



// Product Routes
router.get('/products/', authjwt ,adminRole , retrieveProducts);
router.get('/products/vendor/:userId', authjwt,adminRole, retrieveVendorProducts);
router.get('/products/top-deals', authjwt,adminRole , retrieveTopDeals);
router.get('/products/today-deals',authjwt,adminRole, retrieveTodayDeals);
router.get('/products/search', authjwt,adminRole, getMatchedProducts);
router.get('/products/:id', authjwt,adminRole, retrieveProduct);
router.delete('/products/:id', authjwt,adminRole, deleteProduct);


/* Routes Handlers */
// Retrieve all products
function retrieveProducts(req, res, next) {
    getProducts(req, res)
    .then(result => res.json(result))
    .catch(error => next(error));
}

// Retrieve vendor's products
function retrieveVendorProducts(req, res, next) {
    const { userId } = req.params;
    const { page, limit } = req.query;
    getVendorProducts(userId, page, limit)
    .then(result => res.json({result: result}))
    .catch(error => next(error));
}

// Retrieve a product by id
function retrieveProduct(req, res, next) {
    const { id } = req.params;
    getProduct(id)
    .then(result => res.json(result))
    .catch(error => next(error));
}


// Retrieve Top Deals products
function retrieveTopDeals(req, res, next){
    const { page, limit } = req.query;
    getTopDeals(page, limit)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}

// Search a product
function getMatchedProducts(req, res, next){
    const { key } = req.query;
    searchProducts(key)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}

// Retrieve Daily deals
function retrieveTodayDeals(req, res, next) {
    const { page, limit } = req.query;
    getTodayDeals(page, limit)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}


// Remove a product 
function deleteProduct(req, res, next) {
    const { userId } = req;
    const { id } = req.params;
    remove(id, userId).then(result => res.json({ message: "Product has been deleted", result: result }))
    .catch(error => next(error));
}

module.exports = router;