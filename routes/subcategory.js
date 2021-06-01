const express = require('express');
const router = express.Router();
const { getProductsOfSubcategory } = require('../services/subcategory');


router.get('/:id/products', retrieveProductsOfSubcategory);


function retrieveProductsOfSubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { page, limit } = req.query;
    getProductsOfSubcategory(subcategoryId, page, limit).then(result => res.json({result: result}))
    .catch(error => next(error));
}

module.exports = router;