/* eslint-disable no-undef */
const User = require('../models/user');
const PaymentMethod = require('../models/paymentMethods');
const WishList = require('../models/wishList');
const Cart = require('../models/cart');
const CustomError = require('../functions/errorHandler');
const nodemailer = require('nodemailer');

//Function to query user by email from database
const findOneUserByEmail = async (email) => {
    return await User.findOne({ email: email }).exec();
};

//Function to query user by id from database
const findOneUserById = async (id) => {
    return await User.findOne({ _id: id }).exec();
};

//Function to create user essential Data objects
const createUserData = async (id) => {
    try {
        await PaymentMethod.create({ userId: id });
        await Cart.create({ userId: id });
        await WishList.create({ userId: id });
    } catch (error) {
        new CustomError(error.toString(), 400);
    }
};

//get user data
const getUser = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    const loadedUser = await findOneUserById(userId);

    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);

    try {
        return { user: loadedUser };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }

};

//login user and return token
const login = async (req) => {
    const { email, password } = req.body;
    const loadedUser = await findOneUserByEmail(email);
    //return error if email is not register
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);

    //return error if password didn't match the database
    const validPass = await loadedUser.validatePassword(password);
    if (!validPass)
        new CustomError('WRONG_PASSWORD', 401);

    try {
        //create token and return it
        const token = await loadedUser.generateTokenAccess();
        return { token: token, userId: loadedUser.id };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }

};

//send reset password token to mail
const reset = async (req, res) => {
    const { email } = req.body;
    const loadedUser = await findOneUserByEmail(email);
    //return error if email is not register
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);

    await loadedUser.generatePasswordReset();

    const smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        port: process.env.SENDGRID_PORT,
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        }
    });
    const mailOptions = {
        to: loadedUser.email,
        from: process.env.MAIL_FROM,
        subject: 'Locage Account Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            process.env.FRONT_URL + '/recover/' + loadedUser.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    try {
        await smtpTransport.sendMail(mailOptions);
        return { message: 'RESET_EMAIL_SENT', email: loadedUser.email };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }
};

//update password if reset token is valid or not expired
const recover = async (req, res) => {
    const loadedUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
    if (!loadedUser)
        new CustomError('PASSWORD_RESET_TOKEN_INVALID_OR_EXPIRED', 401);

    loadedUser.password = req.body.password;
    loadedUser.resetPasswordToken = undefined;
    loadedUser.resetPasswordExpires = undefined;
    await loadedUser.save();
    const smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        port: process.env.SENDGRID_PORT,
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        }
    });
    const mailOptions = {
        to: loadedUser.email,
        from: process.env.MAIL_FROM,
        subject: 'Locage password has been changed',
        text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + loadedUser.email + ' has just been changed.\n'
    };

    try {
        await smtpTransport.sendMail(mailOptions);
        return { message: 'PASSWORD_CHANGED', email: loadedUser.email };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }
};

//register user and return user data and token
const register = async (req, res) => {
    const body = req.body;
    const loadedUser = await findOneUserByEmail(body.email);
    //return error if email is already registered
    if (loadedUser)
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    //create user object
    const createdUser = new User(body);
    //save user object in database and hash the password
    await createdUser.save();
    //create user data requirments
    await createUserData(createdUser._id);

    //return user data and token after create
    try {
        const token = await createdUser.generateTokenAccess();
        return { message: "ACCOUNT_CREATED", token: token, userId: createdUser.id };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }
};

const update = async (req, res) => {
    const userId = req.userId;
    const { body } = req;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    const loadedUser = await findOneUserById(userId);

    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);

    if (loadedUser.email !== body.email && await findOneUserByEmail(body.email))
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        new CustomError('NOTHING_CHANGED', 400);
    }

    try {
        await User.findOneAndUpdate({ _id: userId }, body);
        return { message: "ACCOUNT_UPDATED" };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }

};

const updatePassword = async (req, res) => {
    const userId = req.userId;
    const { body } = req;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    const loadedUser = await findOneUserById(userId);

    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);
    //return error if password didn't match the database
    const validPass = await loadedUser.validatePassword(body.currentPassword);
    if (!validPass)
        new CustomError('WRONG_PASSWORD', 401);

    try {
        await User.findOneAndUpdate({ _id: userId }, { password: body.password });
        return { message: "PASSWORD_UPDATED" };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }

};

const deleteAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    const loadedUser = await findOneUserById(userId);
    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);

    try {
        const result = await loadedUser.remove();
        return { message: "ACCOUNT_DELETED", result: result };
    } catch (error) {
        new CustomError(error.toString(), 400);
    }

};

const checkMail = async (req, res) => {
    const body = req.body;
    const loadedUser = await findOneUserByEmail(body.email);
    //return error if email is already registered
    if (loadedUser)
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    return { message: "EMAIL_NOT_REGISTER" };
};

module.exports = {
    login,
    getUser,
    register,
    reset,
    recover,
    update,
    updatePassword,
    deleteAccount,
    checkMail
};