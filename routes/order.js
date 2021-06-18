const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, getVendorOrdersItems, cancel, changeStatus, getPaymentToken } = require('../services/order');
const authjwt = require("../middlewares/authjwt");
const { adminRole, vendorRole } = require("../middlewares/roles");


router.get('/client-token', getToken);

router.post('/checkout', authjwt, placeOrder);
//TODO: Move To Admin Section
router.get('/', authjwt, adminRole, retrieveAllOrders);

router.get('/:id', authjwt, retrieveOrder);

router.get('/vendor', authjwt, vendorRole, retrieveVendorOrdersItems);

router.patch('/:id/cancel', authjwt, cancelOrder);

router.patch('/:id/status', authjwt, adminRole, changeOrderStatus);

//get payment token
function getToken(req, res, next) {
    getPaymentToken(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}


/* Routes Handlers */
function placeOrder(req, res, next) {
    const { userId, body: shipmentAndDiscount , nonce } = req;
    createOrder(userId, shipmentAndDiscount ,nonce)
        .then(result => res.status(201).json({ message: "Order placed successfully.", result: result }))
        .catch(error => next(error));
}

function retrieveAllOrders(req, res, next) {
    const { page, limit } = req.query;
    getOrders(page, limit)
        .then(result => res.json({ result: result }))
        .catch(error => next(error));
}

function retrieveOrder(req, res, next) {
    const { userId } = req;
    const { id: orderId } = req.params;
    getOrder(orderId, userId)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}

function retrieveVendorOrdersItems(req, res, next) {
    const { page, limit } = req.query;
    const { user: vendor } = req;
    getVendorOrdersItems(vendor, page, limit)
        .then(result => res.json({ result: result }))
        .catch(error => next(error));
}

function cancelOrder(req, res, next) {
    const { id: orderId } = req.params;
    const { userId } = req;
    cancel(userId, orderId)
        .then(result => {
            if (result.status === 'cancelled')
                res.json({ message: "Order has been cancelled successfully.", result: result })
            res.json({ message: "Order couldn't be cancelled.", result: result })
        })
        .catch(error => next(error));
}

function changeOrderStatus(req, res, next) {
    const { id: orderId } = req.params;
    const { body: orderStatus } = req;
    changeStatus(orderId, orderStatus)
        .then(result => res.json({ message: "Order status has been changed successfully.", result: result }))
        .catch(error => next(error));
}

module.exports = router;