const express = require('express');
const router = express.Router();
const { getOrders } = require('../services/order');

router.route('/')
    .get(retrieveOrders)

/* Routes Handlers */
function retrieveOrders(req, res, next){
    getOrders().then(result => res.json({ result: result }))
    .catch(error => next(error));
}



module.exports = router;