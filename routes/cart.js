const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const {
    // getUserCart ,
      cartDetail ,
     addCart ,
    //removeCart ,
   // emptyCart 
} = require('../services/cart');

//router.get('/:id',authjwt, getCart);

router.get('/:id/product', authjwt, getCartDetails);

router.post('/:id/product/:productId',authjwt, addToCart);

//router.delete('/:id',authjwt, removeAllCart);

//router.delete('/product/:productId',authjwt, removeFromCart);

// function getCart(req, res, next) {
//     getUserCart(req, res, next).then((result) => {
//         res.json(result);
//     }).catch((err) => {
//         next(err);
//     });
// }

function getCartDetails(req, res, next) {
    cartDetail(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function addToCart(req, res, next) {
    addCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

// function removeFromCart(req, res, next) {
//     removeCart(req, res, next).then((result) => {
//         res.json(result);
//     }).catch((err) => {
//         next(err);
//     });
// }

// function removeAllCart(req, res, next) {
//     emptyCart(req, res, next).then((result) => {
//         res.json(result);
//     }).catch((err) => {
//         next(err);
//     });
// }

module.exports = router;