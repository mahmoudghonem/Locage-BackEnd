const CustomError = require('../functions/errorHandler');
const User = require('../models/user');
const Product = require('../models/product');
const WishList = require('../models/wishList');
const WishListItem = require('../models/wishListItem');

//Function to query user by id from database
const findOneUserById = async (id) => {
    const loadedUser = await User.findOne({ _id: id }).exec();
    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);

    return loadedUser;
};

const checkIfProductAlreadyIn = async (wishListId, productId) => {
    return await WishListItem.findOne({ wishListId: wishListId, productId: productId }).exec();
};


const userWishList = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);
    const wishList = await WishList.findOne({ userId: userId }).exec();

    await WishListItem.find({ wishListId: wishList._id }).then((result) => {
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

    const wishListItems = await WishListItem.find({ wishListId: wishList._id }).distinct('productId').exec();

    await Product.find({ _id: { $in: wishListItems } }).then((result) => {
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

    const wishList = await WishList.findOne({ userId: userId }).exec();

    const body = {
        wishListId: wishList._id,
        productId: product._id
    };

    const fondedItem = await checkIfProductAlreadyIn(wishList._id, product._id);
    if (fondedItem)
        new CustomError('ALREADY_ADDED', 400);

    const wishListItem = new WishListItem(body);
    await wishListItem.save(wishListItem).then(() => {
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
    const wishList = await WishList.findOne({ userId: userId }).exec();

    const product = await Product.findById(productId).exec();
    if (!product)
        new CustomError('PRODUCT_NOT_FOUND', 404);

    const fondedItem = await checkIfProductAlreadyIn(wishList._id, productId);
    if (!fondedItem)
        new CustomError('WISH_LIST_ITEM_NOT_FOUND', 400);

    await WishListItem.findOneAndRemove({ wishListId: wishList._id, productId: productId }).then((result) => {
        return res.status(200).json({ message: "REMOVED_SUCCESSFULLY", result: result });
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
    const wishList = await WishList.findOne({ userId: userId }).exec();

    await WishListItem.deleteMany({ wishListId: wishList._id }).then(() => {
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