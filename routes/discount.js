const express = require('express');
const router = express.Router();
const authjwt = require("../middlewares/authjwt");
const { adminRole } = require("../middlewares/roles");
const { getDiscountCodes, createDiscount, editDiscount } = require('../services/discount');

router.get('/', authjwt, adminRole, retrieveDiscountCodes);
router.post('/', authjwt, adminRole, addDiscountCodes);
router.patch('/:id', authjwt, adminRole,editDiscountCodes);


function retrieveDiscountCodes(req, res, next) {
    const { page, limit } = req.query;
    getDiscountCodes(page, limit)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}

function addDiscountCodes(req, res, next) {
    const { body: discountData } = req;
    createDiscount(discountData)
    .then(result => res.status(201).json({ message: "Discount code added successfully.", result: result }))
    .catch(error => next(error));
}




module.exports = router;