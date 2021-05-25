const express = require('express');
const router = express.Router();

router.get('/', retrieveAllProducts);

function retrieveAllProducts(req, res){
    res.json("Here it comes..");
}


module.exports = router;