const express = require('express');
const router = express.Router();
const { vendorDetails, oneVendorDetails, oneStoreDetails, storeDetails, approveStore, disapproveStore } = require('../../services/admin/vendorAdmin');
const authjwt = require('../../middlewares/authjwt');
const { staffRole } = require('../../middlewares/roles');


//Vendors only details (role access staff and admin)
router.get('/vendors', authjwt, staffRole, getAllVendors);
router.get('/vendors/:id', authjwt, staffRole, getOneVendor);
//Stores only details (role access staff and admin)
router.get('/stores', authjwt, staffRole, getAllStores);
router.route('/stores/:id')
    .get(authjwt, staffRole, getOneStore);
//Stores statues to be accepted or decline (role access staff and admin)    
router.route('/stores/:id/status')
    .patch(authjwt, staffRole, acceptStore)
    .delete(authjwt, staffRole, declineStore);



//get all vendor request method
function getAllVendors(req, res, next) {
    vendorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one vendor request method
function getOneVendor(req, res, next) {
    oneVendorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//get all stores request method
function getAllStores(req, res, next) {
    storeDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one store request method
function getOneStore(req, res, next) {
    oneStoreDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//accept store to work request method
function acceptStore(req, res, next) {
    approveStore(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//decline store to work request method
function declineStore(req, res, next) {
    disapproveStore(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;