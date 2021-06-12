const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../services/order');
const authjwt = require("../middlewares/authjwt");
const { adminRole } = require("../middlewares/roles");


router.post('/', authjwt, placeOrder);
router.get('/', authjwt, adminRole, retrieveAllOrders);

/* Routes Handlers */
function placeOrder(req, res, next) {
    const { userId, body: shipmentAndDiscount } = req;
    createOrder(userId, shipmentAndDiscount)
    .then(result => res.status(201).json({message: "Order placed successfully.", result: result }))
    .catch(error => next(error));
}

function retrieveAllOrders(req, res, next) {
    const { page, limit } = req.query;
    getOrders(page, limit)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}



module.exports = router;