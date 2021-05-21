const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { register, login, reset, recover, update } = require('../services/user');
const { registerValidationRules, resetValidationRules, loginValidationRules, recoverValidationRules, updateValidationRules, validate } = require('../middlewares/userValidator');

router.get('/login', loginValidationRules(), validate, userLoginFun);
router.get('/reset-password', resetValidationRules(), validate, userResetFun);
router.post('/recover/:token', recoverValidationRules(), validate, userRecoverFun);
router.post('/register', registerValidationRules(), validate, userRegisterFun);
router.post('/update', authjwt, updateValidationRules(), validate, userUpdateFun)
function userLoginFun(req, res, next) {
    login(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    })
}
function userResetFun(req, res, next) {
    reset(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    })
}
function userRecoverFun(req, res, next) {
    recover(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    })
}
function userRegisterFun(req, res, next) {
    register(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    })
}
function userUpdateFun(req, res, next) {
    update(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    })
}

module.exports = router;