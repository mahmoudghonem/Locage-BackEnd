const express = require('express');
const router = express.Router();
const {  getProductsNotReview ,
         getReviews ,
        addReview ,
        updateRev , 
        removeReview ,
 } = require('../services/review');
const authjwt = require("../middlewares/authjwt");


router.get('/products', authjwt, getProducts);
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', authjwt, addReviewToProduct);
router.patch('/:id', authjwt, updateReview);
router.delete('/:id', authjwt, deletReview);

// Get All products want review
function getProducts(req, res, next) {
    getProductsNotReview(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
} 
// Get All reviews of product 
function getProductReviews(req, res, next) {
    getReviews(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

    // Add review to product 
function addReviewToProduct(req, res, next) {
    addReview(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

// update you review 
function updateReview(req, res, next) {
    updateRev(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

    // delete you review   
function deletReview(req, res, next) {
    removeReview(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}



module.exports = router;