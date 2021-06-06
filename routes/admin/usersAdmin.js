const express = require('express');
const router = express.Router();
const { usersDetails, oneUserDetails, oneUserRemove, manyUserRemove } = require('../../services/admin/usersAdmin');
const authjwt = require('../../middlewares/authjwt');
const { stuffRole } = require('../../middlewares/roles');

// get details
//customers only details (role access stuff and admin)
router.get('/users', authjwt, stuffRole, getAllUsers);
router.get('/users/:id', authjwt, stuffRole, getOneUser);
router.delete('/users/:id', authjwt, stuffRole, deleteOneUser);
router.delete('/users/', authjwt, stuffRole, deleteManyUser);

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

//delete One user request method
function deleteOneUser(req, res, next) {
    oneUserRemove(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//delete many user request method
function deleteManyUser(req, res, next) {
    manyUserRemove(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;