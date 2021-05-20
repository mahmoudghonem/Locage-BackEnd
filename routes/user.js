const express = require('express');
const router = express.Router();
const { register, login, reset, recover } = require('../services/user');
const { registerValidationRules, resetValidationRules, loginValidationRules, recoverValidationRules, validate } = require('../middlewares/userValidator');

router.get('/login', loginValidationRules(), validate, userLoginFun);
router.get('/reset-password', resetValidationRules(), validate, userResetFun);
router.post('/recover/:token', recoverValidationRules(), validate, userRecoverFun);
router.post('/register', registerValidationRules(), validate, userRegisterFun);

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

module.exports = router;