const express = require('express');
const CustomError = require('../functions/errorHandler');
const router = express.Router();
const userRouter = require('./user');
const storeRouter = require('./store');
const paymentRouter = require('./payment');


router.use('/users', userRouter);
router.use('/stores', storeRouter);
router.use('/payments', paymentRouter);


//set not found router middleware
router.use((req, res, next) => {
    console.log('test');
    try {
        new CustomError('ROUTE_NOT_FOUND', 404);
    } catch (e) {
        next(e);
    }
});
module.exports = router;