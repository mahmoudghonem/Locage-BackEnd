const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { getUserCart ,
        cartDetail ,
        addCart ,
        addItemsCart ,
        updateCart,
       removeCart ,
       emptyCart } = require('../services/cart');

router.get('/items',authjwt, getCart);

router.get('/product/', authjwt, getCartDetails);

router.post('/product/:productId',authjwt, addToCart);

router.post('/products/',authjwt, addItemsToCart);


router.patch('/product/:productId',authjwt, updateItemInCart);


router.delete('/product/:productId',authjwt, removeFromCart);

router.delete('/emptyCart',authjwt, removeAllCart);


function getCart(req, res, next) {
    getUserCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

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
function addItemsToCart(req, res, next) {
    addItemsCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function updateItemInCart(req, res, next) {
    updateCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function removeFromCart(req, res, next) {
    removeCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function removeAllCart(req, res, next) {
    emptyCart(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;