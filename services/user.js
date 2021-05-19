/* eslint-disable no-undef */
const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

//Function to query user by id from database
const findOneUserByEmail = async (email) => {
    return await User.findOne({ email: email }).exec();
}

//login user and return token
const login = async (req, res) => {
    const { email, password } = req.body;
    const loadedUser = await findOneUserByEmail(email);
    //return error if email is not register
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 401);

    //return error if password didn't match the database
    const vaildPass = loadedUser.validatePassword(password);
    if (!vaildPass)
        new CustomError('WRONG_PASSWORD', 401);

    //create token and return it
    await loadedUser.createTokenAccess().then((result) => {
        return res.status(200).json({ token: result, userId: loadedUser.id });
    }).catch((error) => {
        CustomError(error.toString(), 400);
    });
}
//register user and return user data and token
const register = async (req, res) => {
    const body = req.body;
    const loadedUser = await findOneUserByEmail(body.email);
    //return error if email is already registered
    if (loadedUser)
        new CustomError('EMAIL_ALREADY_REGISTER', 401);

    const createdUser = new User(body);
    await createdUser.save();
    //return user data and token after create
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