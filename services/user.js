/* eslint-disable no-undef */
const User = require('../models/user');
const PaymentMethod = require('../models/paymentMethods');
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
    await PaymentMethod.create({ userId: id });
    await Cart.create({ userId: id });
};

//login user and return token
const login = async (req, res) => {
    const { email, password } = req.body;
    const loadedUser = await findOneUserByEmail(email);
    //return error if email is not register
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);

    //return error if password didn't match the database
    const validPass = await loadedUser.validatePassword(password);
    if (!validPass)
        new CustomError('WRONG_PASSWORD', 401);

    //create token and return it
    await loadedUser.generateTokenAccess().then((result) => {
        return res.status(200).json({ token: result, userId: loadedUser.id });
    }).catch((error) => {
        new CustomError(error.toString(), 400);
    });
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
        subject: 'Locage Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/recover/' + loadedUser.resetPasswordToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    await smtpTransport.sendMail(mailOptions).then(() => {
        return res.status(200).json({ message: 'RESET_EMAIL_SENT', email: loadedUser.email });
    }).catch((error) => {
        new CustomError(error.toString(), 400);
    });

};

//update password if reset token is vaild or not expired
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
    await smtpTransport.sendMail(mailOptions).then(() => {
        return res.status(200).json({ message: 'PASSWORD_CHANGED', email: loadedUser.email });
    }).catch((error) => {
        new CustomError(error.toString(), 400);
    });

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
    await createdUser.generateTokenAccess().then((result) => {
        return res.status(200).json({ message: "ACCOUNT_CREATED", token: result, userId: createdUser.id });
    }).catch((error) => {
        new CustomError(error.toString(), 400);
    });
};

const update = async (req, res) => {
    const userId = req.userId;
    const { body } = req;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    const loadedUser = await findOneUserById(userId);

    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);

    if (loadedUser.email !== body.email && await findOneUserByEmail(body.email))
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    await User.findByIdAndUpdate({ _id: userId }, body).then((result) => {
        return res.status(200).json({ message: "ACCOUNT_UPDATED", result: result });
    }).catch((error) => {
        CustomError(error.toString(), 400);

    });

};

module.exports = {
    login,
    register,
    reset,
    recover,
    update
};