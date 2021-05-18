/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');

//401
const auth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization)
        return new Error('AUTHORIZATION_HEADER_REQUIRED');
    try {
        const token = authorization.split(" ")[1];
        let decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
        if (!decodedToken)
            return new Error('NOT_AUTHORIZATION');

        const { id } = decodedToken;
        req.userId = id;
        next();
    } catch (e) {
        next((new Error('NOT_AUTHORIZED')));
    }
}
module.exports = auth;