const express = require('express');
const router = express.Router();
const { getProductsOfSubcategory, editSubcategory, deleteSubcategory } = require('../services/subcategory');
const authjwt = require("../middlewares/authjwt");
const imageFile = require("../middlewares/image");


router.get('/:id/products', retrieveProductsOfSubcategory);

router.route('/:id')
    .patch(authjwt, imageFile.single("photo"), modifySubcategory)
    .delete(authjwt, removeSubcategory)


function retrieveProductsOfSubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { page, limit } = req.query;
    getProductsOfSubcategory(subcategoryId, page, limit).then(result => res.json({result: result}))
    .catch(error => next(error));
}

function modifySubcategory(req, res, next){
    const { id: subcategoryId } = req.params;
    const { body: editedSubcategory, userId, file: photo } = req;
    editSubcategory(editedSubcategory, subcategoryId, userId, photo).then(result => {
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