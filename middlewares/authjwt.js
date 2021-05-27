/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const CustomError = require('../functions/errorHandler');

const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            new CustomError('AUTHORIZATION_HEADER_REQUIRED', 401);
        try {
            const token = authorization.split(" ")[1];
            let decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
            if (!decodedToken)
                new CustomError('NOT_AUTHORIZED', 401);

            const { id } = decodedToken;
            req.userId = id;
            next();
        } catch (e) {
            new CustomError('NOT_AUTHORIZED', 401);
        }
    } catch (e) {
        next(e);
    }
};
module.exports = auth;