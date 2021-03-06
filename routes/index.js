const express = require('express');
const CustomError = require('../functions/errorHandler');
const router = express.Router();
const userRouter = require('./user');
const adminRouter = require('./admin');
const wishlistRouter = require('./wishlist');
const shipmentRouter = require('./shipment');
const storeRouter = require('./store');
const productRouter = require('./product');
const paymentRouter = require('./payment');
const categoryRouter = require('./category');
const subcategoryRouter = require('./subcategory');
const orderRouter = require('./order');
const cartRouter = require('./cart');
const reviewRouter = require('./review');




router.use('/users', userRouter);

router.use('/wishlist', wishlistRouter);

router.use('/shipment', shipmentRouter);

router.use('/admin', adminRouter);

router.use('/stores', storeRouter);

router.use('/products', productRouter);

router.use('/payments', paymentRouter);

router.use('/category', categoryRouter);

router.use('/subcategory', subcategoryRouter);

router.use('/orders', orderRouter);

router.use('/carts', cartRouter);

router.use('/reviews', reviewRouter);



//set not found router middleware
router.use((req, res, next) => {
    try {
        new CustomError('ROUTE_NOT_FOUND', 404);
    } catch (e) {
        next(e);
    }
});
module.exports = router;