const express = require('express');
const router = express.Router();
const { retrieveAllCategories, createCategory } = require('../services/category');
const authjwt = require("../middlewares/authjwt");


router.route('/')
    .get(getCategories)
    .post(authjwt, createnewCategory);

// router.route('/id/subcategory')
//     .get(getSubcategories)
//     .post(authjwt, createNewSubcategory);



function getCategories(req, res, next){
    retrieveAllCategories().then(result => res.json({result: result}))
    .catch(error => next(error));
}

function createnewCategory (req, res, next){
    const { body, userId } = req;
    createCategory(body, userId).then(result => res.status(201).json({message: "Category has been added.", result: result}))
    .catch(error => next(error));
}

// function getSubcategories(req, res, next){

// }

// function createNewSubcategory(req, res, next){
    
// }


module.exports = router;