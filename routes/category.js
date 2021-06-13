const express = require('express');
const router = express.Router();
const imageFile = require("../middlewares/image");
const { retrieveAllCategories, createCategory, retrieveSubcategoriesOfCategory, createSubcategory,
        editCategory, editSubcategory, getProductsOfCategory, deleteCategory } = require('../services/category');
const authjwt = require("../middlewares/authjwt");


router.route('/')
    .get(getCategories)
    .post(authjwt, imageFile.single("photo"), createNewCategory);

router.route('/:id')
    .patch(authjwt, imageFile.single("photo"), modifyCategory)
    .delete(authjwt, removeCategory);

router.get('/:id/products', retrieveProductsOfCategory);

router.route('/:id/subcategory')
    .get(getSubcategories)
    .post(authjwt, imageFile.single("photo"), createNewSubcategory);

router.patch('/:id/subcategory/:subId', authjwt, modifySubcategory);


function getCategories(req, res, next){
    retrieveAllCategories().then(result => res.json({result: result}))
    .catch(error => next(error));
}

function createNewCategory (req, res, next){
    const { body: category, userId, file: photo } = req;
    createCategory(category, userId, photo).then(result => { 
        res.status(201).json({message: "Category has been added.", result: result});
    })
    .catch(error => next(error));
}

function modifyCategory(req, res, next){
    const { id: categoryId } = req.params;
    const { body: editedCategory, userId, file: photo } = req;
    editCategory(editedCategory, categoryId, userId, photo).then(result => {
        res.json({message: "Category has been edited.", result: result});
    })
    .catch(error => next(error));
}

function getSubcategories(req, res, next){
    const { id: categoryId } = req.params;
    retrieveSubcategoriesOfCategory(categoryId).then(result => res.json({result: result}))
    .catch(error => next(error));
}

function createNewSubcategory(req, res, next){
    const { body: subcategory, userId, file: photo } = req;
    const { id: categoryId } = req.params;
    createSubcategory(subcategory, categoryId, userId, photo).then(result => {
        res.status(201).json({message: "Subcategory has been added.", result: result});
    })
    .catch(error => next(error));
}

function modifySubcategory(req, res, next){
    const { id: categoryId, subId: subcategoryId } = req.params;
    const { body: editedSubcategory, userId } = req;
    editSubcategory(editedSubcategory, subcategoryId, categoryId, userId).then(result => {
        res.json({message: "Subcategory has been edited.", result: result});
    })
    .catch(error => next(error));
}

function retrieveProductsOfCategory(req, res, next){
    const { id: categoryId } = req.params;
    const { page, limit } = req.query;
    getProductsOfCategory(categoryId, page, limit).then(result => res.json({result: result}))
    .catch(error => next(error));
}

function removeCategory(req, res, next){
    const { id: categoryId } = req.params;
    const { userId } = req;
    deleteCategory(categoryId, userId).then(result => {
        res.json({message: "Category has been deleted.", result: result});
    })
    .catch(error => next(error));
}


module.exports = router;