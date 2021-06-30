/* eslint-disable no-unused-vars */
const Store = require("../models/store");
const User = require("../models/user");
const CustomError = require('../functions/errorHandler');
const cloudinary = require("../functions/cloudinary");

//Get all stores
async function getAll(req, res) {
    const { limit } = req.query;
    const { page } = req.query;

    const options = {
        limit: limit || 10,
        page: page || 1,
    };
    return await Store.paginate({}, options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            new CustomError(err.toString());
        });
}


//Getone store
async function getOne(req, res) {
    const { id } = req.params;
    const store = await Store.findById(id).populate("userId").exec();
    if (!store)
        new CustomError("NOT_FOUND", 404);
    else
        return store;
}

//Getone store
async function check(req, res) {
    const { userId } = req.params;
    const store = await Store.findOne({userId:userId}).populate("userId").exec();
    if (!store)
        new CustomError("NOT_FOUND", 404);
    else
        return store;
}


//Post one store
async function create(req, res) {
    const { body, file, userId } = req;
    let store;
    const getUser = await User.findById(userId).exec();
    if (!getUser)
        new CustomError("UNAUTHORIZED", 401);
    const userState = await Store.findOne({ userId: userId }).exec();
    if (userState) {
        return CustomError("CANT_CREATE_NEW_STORE", 400);
    }

    // if(getUser.role != 'vendor')
    //     new CustomError("UNAUTHORIZED", 401);

    if (file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        body.photo = image;
        await Store.create({ ...body, userId: userId }).then((result) => {
            return result;
        }).catch((err) => {
            new CustomError(err.toString());
        });
    } else {
        await Store.create({ ...body, userId: userId ,photo:null })
            .then((result) => {
                return result;
            }).catch((err) => {
                new CustomError(err.toString());
            });
    }

    return store;

}

//Update one store
async function update(req, res) {
    const { body, userId } = req;
    const { id } = req.params;
    const getUser = await User.findById(userId).exec();
    const store = await Store.findOne({userId: id});

    if (!store)
        new CustomError("NOT_FOUND", 404);
    if (getUser.role != 'vendor')
        new CustomError("UNAUTHORIZED", 401);
    const file = req.file | false;
    const _id = store._id;
    if (file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        body.photo = image;
       
        return await Store.findByIdAndUpdate({ _id }, { ...body }, { new: true });
      
    } else {

        return await Store.findByIdAndUpdate({ _id }, { ...body }, { new: true });
    }
}


//Delete one store 
async function remove(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const store = getOne(id);
    const getUser = await User.findById(userId).exec();
    if (!store)
        new CustomError("NOT_FOUND", 404);
    if (getUser.role == 'user')
        new CustomError("UNAUTHORIZED", 401);
    await Store.findByIdAndDelete(id);
}


//export all functions
module.exports = {
    getAll,
    getOne,
    check,
    create,
    update,
    remove
};

