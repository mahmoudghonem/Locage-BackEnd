const express = require('express');
const router = express.Router();
const { getProductReviews , getVendorReviews } = require('../../services/admin/reviewAdmin');
const authjwt = require('../../middlewares/authjwt');
const { adminRole } = require('../../middlewares/roles');


//Admins only details (role access admin)
router.get('/review/product/:productId', authjwt, adminRole, reviewProduct);
router.get('/review/vendor/:_id', authjwt, adminRole, reviewVendor);



//get product review
function reviewProduct(req, res, next) {
    getProductReviews(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get vendor review
function reviewVendor(req, res, next) {
    getVendorReviews(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}


module.exports = router;
