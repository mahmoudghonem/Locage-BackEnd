const express = require('express');
const router = express.Router();
const { login } = require('../services/user');
const { loginValidationRules, validate } = require('../middlewares/vaildator');

router.get('/login', loginValidationRules(), validate, userLoginFun);

function userLoginFun(req, res, next) {
    login(req, res).then((result) => {
        res.json(result);
    }).catch((err) => {
        if (!err.statusCode)
            err.statusCode = 500;

        next(err);
    })
}

module.exports = router;