const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { register, login, reset, recover, update } = require('../services/user');
const { registerValidationRules, resetValidationRules, loginValidationRules, recoverValidationRules, updateValidationRules, validate } = require('../middlewares/userValidator');

/** 
 * @description Call get request to /api/v1/users/login to get token information of sign in
 * @author ~
 * @version 1
 * @param {String} email - the email address of the user
 * @param {String} password - the password of the user
 * @return {token: token , userId: user id} - the generated jwt token and user id
 * @throws EMAIL_REQUIRED - if email not provided
 * @throws WRONG_EMAIL_FORMAT - if email not in right format
 * @throws PASSWORD_REQUIRED - if password not in provided
 * @throws PASSWORD_MUST_8_CHARACTERS_LONG - if password not 8 characters long
 * */

router.get('/login', loginValidationRules(), validate, userLoginFun);

/** 
 * @description Call post request to /api/v1/users/reset-password to get reset password email
 * @author ~
 * @version 1
 * @param {String} email - the email address of the user
 * @return {message: 'RESET_EMAIL_SENT', email: email} - success message and user email
 * @throws EMAIL_REQUIRED - if email not provided
 * @throws WRONG_EMAIL_FORMAT - if email not in right format
 * */

router.post('/reset-password', resetValidationRules(), validate, userResetFun);

/** 
 * @description Call post request to /api/v1/users/recover/:token to get reset password email
 * @author ~
 * @version 1
 * @param {String} token - the token from email sent form reset password request {url}
 * @param {String} password - the new password of the user
 * @return {message: 'PASSWORD_CHANGED', email: email } - success message and user email
 * @throws PASSWORD_REQUIRED - if password not in provided
 * @throws PASSWORD_MUST_8_CHARACTERS_LONG - if password not 8 characters long
 * */

router.post('/recover/:token', recoverValidationRules(), validate, userRecoverFun);

/** 
 * @description Call get request to /api/v1/users/register to register new user account
 * @author ~
 * @version 1
 * @param {String} email - the email address of the user
 * @param {String} password - the password of the user
 * @return { message: "ACCOUNT_CREATED", token: result, userId: id } - the generated jwt token and user id and success message
 * @throws FIRSTNAME_REQUIRED - if first name not provided
 * @throws FIRSTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX - if didn't pass validation 3 min 30 max characters
 * @throws LASTNAME_REQUIRED - if first name not provided
 * @throws LASTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX - if didn't pass validation 3 min 30 max characters
 * @throws EMAIL_REQUIRED - if email not provided
 * @throws WRONG_EMAIL_FORMAT - if email not in right format
 * @throws PASSWORD_REQUIRED - if password not in provided
 * @throws PASSWORD_MUST_8_CHARACTERS_LONG - if password not 8 characters long
 * */

router.post('/register', registerValidationRules(), validate, userRegisterFun);

/** 
 * @description Call get request to /api/v1/users/:id to update user data
 * @author ~
 * @version 1
 * @param {String} id - user id
 * @return { message: "ACCOUNT_UPDATED", result: result } - success message and user new data
 * all new data are optional to push in body
 * @throws FIRSTNAME_REQUIRED - if first name not provided
 * @throws FIRSTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX - if didn't pass validation 3 min 30 max characters
 * @throws LASTNAME_REQUIRED - if first name not provided
 * @throws LASTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX - if didn't pass validation 3 min 30 max characters
 * @throws EMAIL_REQUIRED - if email not provided
 * @throws WRONG_EMAIL_FORMAT - if email not in right format
 * @throws PASSWORD_REQUIRED - if password not in provided
 * @throws PASSWORD_MUST_8_CHARACTERS_LONG - if password not 8 characters long
 * */

router.patch('/:id', authjwt, updateValidationRules(), validate, userUpdateFun);

//login get request method
function userLoginFun(req, res, next) {
    login(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//reset password request method
function userResetFun(req, res, next) {
    reset(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//recover password request method
function userRecoverFun(req, res, next) {
    recover(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//user register request method
function userRegisterFun(req, res, next) {
    register(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

//user update request method
function userUpdateFun(req, res, next) {
    update(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;