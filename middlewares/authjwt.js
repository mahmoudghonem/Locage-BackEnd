/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const CustomError = require('../functions/errorHandler');

const auth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization)
        return new CustomError('AUTHORIZATION_HEADER_REQUIRED', 401);
    try {
        const token = authorization.split(" ")[1];
        let decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
        if (!decodedToken)
            return new CustomError('NOT_AUTHORIZATION', 401);

        const { id } = decodedToken;
        req.userId = id;
        next();
    } catch (e) {
        next((new CustomError('NOT_AUTHORIZED', 401)));
    }
}
module.exports = auth;