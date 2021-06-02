const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { register, login, reset, recover, update, checkMail } = require('../services/user');
const { registerValidationRules, resetValidationRules, loginValidationRules, recoverValidationRules, updateValidationRules, validate } = require('../middlewares/userValidator');


router.get('/login', loginValidationRules(), validate, userLoginFun);

router.get('/isEmailRegister', resetValidationRules(), validate, checkEmailRegister)

router.post('/reset-password', resetValidationRules(), validate, userResetFun);

router.post('/recover/:token', recoverValidationRules(), validate, userRecoverFun);

router.post('/register', registerValidationRules(), validate, userRegisterFun);

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

//check Email If exists
function checkEmailRegister(req, res, next) {
    checkMail(req, res).then((result) => {
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