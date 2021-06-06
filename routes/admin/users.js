const express = require('express');
const router = express.Router();
const { usersDetails, oneUserDetails } = require('../../services/admin');
const authjwt = require('../../middlewares/authjwt');
const { stuffRole } = require('../../middlewares/roles');

// get details
//customers only details (role access stuff and admin)
router.get('/users', authjwt, stuffRole, getAllUsers);
router.get('/users/:id', authjwt, stuffRole, getOneUser);

//get all users request method
function getAllUsers(req, res, next) {
    usersDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//get One user request method
function getOneUser(req, res, next) {
    oneUserDetails(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;