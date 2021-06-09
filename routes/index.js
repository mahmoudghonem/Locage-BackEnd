const express = require('express');
const CustomError = require('../functions/errorHandler');
const router = express.Router();
const userRouter = require('./user');
const adminRouter = require('./admin');
const wishlistRouter = require('./wishlist');
const storeRouter = require('./store');
const productRouter = require('./product');
const paymentRouter = require('./payment');
const categoryRouter = require('./category');
const subcategoryRouter = require('./subcategory');
const cartRouter = require('./cart');


router.use('/users', userRouter);

router.use('/wishlist', wishlistRouter);

router.use('/admin', adminRouter);

router.use('/stores', storeRouter);

router.use('/products', productRouter);

router.use('/payments', paymentRouter);

router.use('/category', categoryRouter);

router.use('/subcategory', subcategoryRouter);

router.use('/cart', cartRouter);


//set not found router middleware
router.use((req, res, next) => {
    try {
        new CustomError('ROUTE_NOT_FOUND', 404);
    } catch (e) {
        next(e);
    }
});
module.exports = router;