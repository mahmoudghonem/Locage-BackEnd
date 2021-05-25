const express = require('express');
const router = express.Router();
const userRouter = require('./user')
const storeRouter = require('./store')


router.use('/users', userRouter);

router.use('/stores', storeRouter);


module.exports = router;