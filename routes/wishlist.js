const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { userWishList, userWishListDetails, addWishList, removeWishList, emptyWishList } = require('../services/wishlist');

router.route('/:id')
    .get(authjwt, getUserWishList)
    .delete(authjwt, removeAllWishList);

router.get('/:id/product', authjwt, getUserWishListDetails);

router.route('/:id/product/:productId')
    .patch(authjwt, addToWishList)
    .delete(authjwt, removeFromWishList);


function getUserWishList(req, res, next) {
    userWishList(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function getUserWishListDetails(req, res, next) {
    userWishListDetails(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function addToWishList(req, res, next) {
    addWishList(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function removeFromWishList(req, res, next) {
    removeWishList(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
function removeAllWishList(req, res, next) {
    emptyWishList(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;