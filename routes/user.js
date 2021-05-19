const express = require('express');
const router = express.Router();
const { register, login } = require('../services/user');
const { registerValidationRules, loginValidationRules, validate } = require('../middlewares/vaildator');

router.get('/login', loginValidationRules(), validate, userLoginFun);
router.post('/register', registerValidationRules(), validate, userRegisterFun);

function userLoginFun(req, res, next) {
    login(req, res).then((result) => {
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