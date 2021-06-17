const express = require('express');
const router = express.Router();
const authjwt = require("../middlewares/authjwt");
const { createShipment, updateShipment, removeShipment, userShipments, getOneUserShipment,getPrimary } = require("../services/shipment");

router.route('/:id')
    .get(authjwt, getUserShipments)
    .post(authjwt, addUserShipment);

router.get('/:id/primary',authjwt, getUserPrimary)           ; 

router.route('/:id/:shipmentId')
    .get(authjwt, getOneShipment)
    .patch(authjwt, editUserShipment)
    .delete(authjwt, removeOneUserShipment);

function getUserShipments(req, res, next) {
    userShipments(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function getOneShipment(req, res, next) {
    getOneUserShipment(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
function getUserPrimary(req, res, next) {
    getPrimary(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function addUserShipment(req, res, next) {
    createShipment(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function editUserShipment(req, res, next) {
    updateShipment(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function removeOneUserShipment(req, res, next) {
    removeShipment(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;