const express = require('express');
const router = express.Router();
const { getProductsOfSubcategory, editSubcategory, deleteSubcategory } = require('../services/subcategory');
const authjwt = require("../middlewares/authjwt");


router.get('/:id/products', retrieveProductsOfSubcategory);

router.route('/:id')
    .patch(authjwt, modifySubcategory)
    .delete(authjwt, removeSubcategory)


function retrieveProductsOfSubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { page, limit } = req.query;
    getProductsOfSubcategory(subcategoryId, page, limit).then(result => res.json({result: result}))
    .catch(error => next(error));
}

function modifySubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { body: editedSubcategory, userId } = req;
    editSubcategory(editedSubcategory, subcategoryId, userId).then(result => {
        res.json({message: "Subcategory has been edited.", result: result});
    })
    .catch(error => next(error));
}

function removeSubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { userId } = req;
    deleteSubcategory(subcategoryId, userId).then(result => {
        res.json({message: "Subcategory has been deleted.", result: result});
    })
    .catch(error => next(error));
}

module.exports = router;