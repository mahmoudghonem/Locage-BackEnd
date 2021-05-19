/* eslint-disable no-undef */
const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

const findOneUserInDb = async (filterString) => {
    return await User.findOne({ filterString }).exec();
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const loadedUser = await findOneUserInDb(email);
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 401);

    const vaildPass = loadedUser.validatePassword(password);
    if (!vaildPass)
        new CustomError('WRONG_PASSWORD', 401);

    user.createTokenAccess().then((result) => {
        res.status(200).json({ token: result, userId: loadedUser.id.toString() });
    }).catch((error) => {
        CustomError(error.toString(), 400);
    });
}


module.exports = {
    login,
}