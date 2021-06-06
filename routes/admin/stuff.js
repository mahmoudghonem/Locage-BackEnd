const express = require('express');
const router = express.Router();
const { stuffDetails, oneStuffDetails, adminDetails, oneAdminDetails, moderatorDetails, oneModeratorDetails } = require('../../services/admin');
const authjwt = require('../../middlewares/authjwt');
const { adminRole } = require('../../middlewares/roles');


//Admins only details (role access admin)
router.get('/admins', authjwt, adminRole, getAllAdmins);
router.get('/admins/:id', authjwt, adminRole, getOneAdmin);

//Stuff only details (role access admin)
router.get('/stuff', authjwt, adminRole, getAllStuff);
router.get('/stuff/:id', authjwt, adminRole, getOneStuff);

//All Admins And Stuff only details (role access admin)
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

//get all stuff request method
function getAllStuff(req, res, next) {
    stuffDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
//get one stuff request method
function getOneStuff(req, res, next) {
    oneStuffDetails(req, res).then((result) => {
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