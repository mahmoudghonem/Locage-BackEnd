const express = require('express');
const router = express.Router();
const authjwt = require("../middlewares/authjwt");
const { adminRole } = require("../middlewares/roles");
const { getDiscountCodes } = require('../services/discount');

router.get('/', authjwt, adminRole, retrieveDiscountCodes);


function retrieveDiscountCodes(req, res, next) {
    const { page, limit } = req.query;
    getDiscountCodes(page, limit)
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}


module.exports = router;