const express = require('express');
const router = express.Router();
const { staffDetails, oneStaffDetails, makeAccountSubAdmin, adminDetails, oneAdminDetails, moderatorDetails, oneModeratorDetails } = require('../../services/admin/staffAdmin');
const authjwt = require('../../middlewares/authjwt');
const { adminRole } = require('../../middlewares/roles');


//Admins only details (role access admin)
router.get('/admins', authjwt, adminRole, getAllAdmins);
router.get('/admins/:id', authjwt, adminRole, getOneAdmin);

//Staff only details (role access admin)
router.get('/staff', authjwt, adminRole, getAllStaff);
router.route('/staff/:id')
    .get(authjwt, adminRole, getOneStaff)
    .patch(authjwt, adminRole, makeSubAdmin);

//All Admins And Staff only details (role access admin)
router.get('/moderators', authjwt, adminRole, getAllModerators);
router.get('/moderators/:id', authjwt, adminRole, getOneModerator);


//get all admins request method
function getAllAdmins(req, res, next) {
    adminDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one admin request method
function getOneAdmin(req, res, next) {
    oneAdminDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//get all staff request method
function getAllStaff(req, res, next) {
    staffDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one staff request method
function getOneStaff(req, res, next) {
    oneStaffDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//make account subAdmin request method
function makeSubAdmin(req, res, next) {
    makeAccountSubAdmin(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//get all moderators request method
function getAllModerators(req, res, next) {
    moderatorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one moderator request method
function getOneModerator(req, res, next) {
    oneModeratorDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;