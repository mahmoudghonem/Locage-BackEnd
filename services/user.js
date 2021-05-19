/* eslint-disable no-undef */
const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

const findOneUserByEmail = async (email) => {
    return await User.findOne({ email: email }).exec();
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const loadedUser = await findOneUserByEmail(email);
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 401);

    const vaildPass = loadedUser.validatePassword(password);
    if (!vaildPass)
        new CustomError('WRONG_PASSWORD', 401);

    await loadedUser.createTokenAccess().then((result) => {
        return res.status(200).json({ token: result, userId: loadedUser.id });
    }).catch((error) => {
        CustomError(error.toString(), 400);
    });
}
const register = async (req, res) => {
    const body = req.body;
    const loadedUser = await findOneUserByEmail(body.email);
    if (loadedUser)
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    const createdUser = new User(body);
    await createdUser.save();

    await createdUser.createTokenAccess().then((result) => {
        return res.status(200).json({ message: "ACCOUNT_CREATED", user: createdUser.toJSON(), token: result, userId: createdUser.id });
    }).catch((error) => {
        CustomError(error.toString(), 400);
    });
}


module.exports = {
    login,
    register,
}