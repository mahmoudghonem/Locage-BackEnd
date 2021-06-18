const express = require('express');
const router = express.Router();
const { getOrders, getVendorOrdersItems, cancel, changeStatus } = require('../../services/admin/orderAdmin');
const authjwt = require('../../middlewares/authjwt');
const { adminRole , vendorRole} = require('../../middlewares/roles');


//TODO: Move To Admin Section
router.get('/', authjwt, adminRole, retrieveAllOrders);

router.get('/vendor', authjwt, vendorRole, retrieveVendorOrdersItems);

router.patch('/:id/cancel', authjwt, cancelOrder);

router.patch('/:id/status', authjwt, adminRole, changeOrderStatus);



function retrieveAllOrders(req, res, next) {
    const { page, limit } = req.query;
    getOrders(page, limit)
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