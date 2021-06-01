const express = require('express');
const CustomError = require('../functions/errorHandler');
const router = express.Router();
const userRouter = require('./user');
const storeRouter = require('./store');
const productRouter = require('./product');
const paymentRouter = require('./payment');
const categoryRouter = require('./category');
const subcategoryRouter = require('./subcategory');

router.use('/users', userRouter);
router.use('/stores', storeRouter);
router.use('/products', productRouter);
router.use('/payments', paymentRouter);
router.use('/category', categoryRouter);
router.use('/subcategory', subcategoryRouter);


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