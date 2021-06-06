const express = require('express');
const router = express.Router();
const { vendorDetails, oneVendorDetails } = require('../../services/admin');
const authjwt = require('../../middlewares/authjwt');
const { stuffRole } = require('../../middlewares/roles');


//Vendors only details (role access stuff and admin)
router.get('/vendors', authjwt, stuffRole, getAllVendors);
router.get('/vendors/:id', authjwt, stuffRole, getOneVendor);



//get all vendor request method
function getAllVendors(req, res, next) {
    vendorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get all vendor request method
function getOneVendor(req, res, next) {
    oneVendorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;