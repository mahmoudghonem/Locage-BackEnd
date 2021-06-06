/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const CustomError = require('../functions/errorHandler');

const auth = async (req, res, next) => {
    try {
        //get request authorization header
        const { authorization } = req.headers;
        //check if request has authorization header or not
        if (!authorization)
            new CustomError('AUTHORIZATION_HEADER_REQUIRED', 401);
        try {
            //get second header argument (Bearer {token})
            const token = authorization.split(" ")[1];
            //verify token with our secret token
            let decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            //send UNAUTHORIZED if not matched with our secret token
            if (!decodedToken)
                new CustomError('UNAUTHORIZED', 401);

            //return id from token with the request
            const { id } = decodedToken;
            req.userId = id;
            next();
        } catch (e) {
            new CustomError('UNAUTHORIZED', 401);
        }
    } catch (e) {
        next(e);
    }
};
module.exports = auth;