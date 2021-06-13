const express = require('express');
const router = express.Router();
const authjwt = require("../middlewares/authjwt");
const { adminRole } = require("../middlewares/roles");
const { getDiscountCodes, createDiscount, editDiscount, deleteDiscount} = require('../services/discount');

router.get('/', authjwt, adminRole, retrieveDiscountCodes);
router.post('/', authjwt, adminRole, addDiscountCodes);
router.patch('/:id', authjwt, adminRole, editDiscountCodes);
router.delete('/:id', authjwt, adminRole, deleteDiscountCodes);


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

function editDiscountCodes(req, res, next) {
    const { id: discountCodeId } = req.params;
    const { body: discountData } = req;
    editDiscount(discountData, discountCodeId)
    .then(result => res.status(201).json({ message: "Discount code edited successfully.", result: result }))
    .catch(error => next(error));
}

function deleteDiscountCodes(req, res, next) {
    const { id: discountCodeId } = req.params;
    deleteDiscount(discountCodeId)
    .then(result => res.status(201).json({ message: "Discount code has been deleted.", result: result }))
    .catch(error => next(error));
}


module.exports = router;