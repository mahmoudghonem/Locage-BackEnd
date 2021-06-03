const CustomError = require('../functions/errorHandler');
const User = require('../models/user');
const Product = require('../models/product');
const WishList = require('../models/wishList');

//Function to query user by id from database
const findOneUserById = async (id) => {
    const loadedUser = await User.findOne({ _id: id }).exec();
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);

    return loadedUser;
};

const userWishList = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);
    await WishList.findOne({ userId: userId }).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const userWishListDetails = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);
    const wishList = await WishList.findOne({ userId: userId }).exec();
    await Product.find({ _id: { $in: wishList.list } }).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const addWishList = async (req, res) => {
    const { id, productId } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

    await WishList.findOneAndUpdate({ userId: userId }, { $addToSet: { list: productId } }).then(() => {
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const removeWishList = async (req, res) => {
    const { id, productId } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    await WishList.findOneAndUpdate({ userId: userId }, { $pull: { list: productId } }).then(() => {
        return res.status(200).json({ message: "REMOVED_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};

const emptyWishList = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    await WishList.findOneAndUpdate({ userId: userId }, { $set: { list: [] } }).then(() => {
        return res.status(200).json({ message: "REMOVED_ALL_SUCCESSFULLY" });
    }).catch((err) => {
        new CustomError(err.toString());
    });

};


module.exports = {
    userWishList,
    addWishList,
    removeWishList,
    emptyWishList,
    userWishListDetails
};