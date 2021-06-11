const express = require('express');
const router = express.Router();
const { createOrder } = require('../services/order');
const authjwt = require("../middlewares/authjwt");


router.post('/', authjwt, placeOrder);

/* Routes Handlers */
function placeOrder(req, res, next){
    const { userId, body: shipmentAndDiscount } = req;
    createOrder(userId, shipmentAndDiscount)
    .then(result => res.status(201).json({message: "Order placed successfully.", result: result }))
    .catch(error => next(error));
}



module.exports = router;