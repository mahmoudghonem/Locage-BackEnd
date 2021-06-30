const express = require('express');
const router = express.Router();
const { getProductsOfSubcategory, editSubcategory, deleteSubcategory, getSubcategories } = require('../../services/admin/subcatogryAdmin');
const authjwt = require("../../middlewares/authjwt");
const { adminRole } = require('../../middlewares/roles');
const imageFile = require("../../middlewares/image");


router.get('/subcategory/:id/products',authjwt,adminRole, retrieveProductsOfSubcategory);
router.get('/subcategory',authjwt,adminRole, retrieveSubcategories);

router.route('/subcategory/:id')
    .patch(authjwt,adminRole, imageFile.single("photo"), modifySubcategory)
    .delete(authjwt,adminRole, removeSubcategory)


function retrieveSubcategories(req, res, next) {
    getSubcategories()
    .then(result => res.json({ result: result }))
    .catch(error => next(error));
}

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