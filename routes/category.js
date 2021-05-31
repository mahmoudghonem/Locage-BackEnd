const express = require('express');
const router = express.Router();
const { retrieveAllCategories } = require('../services/category');

router.route('/')
    .get(retrieveAllCategories)





module.exports = router;