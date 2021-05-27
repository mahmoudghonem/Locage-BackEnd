const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { userPayments, addBankAccount, userBankAccount, addCreditCard, userCreditCard } = require('../services/payment');

router.get('/:id', authjwt, getUserPayments);
router.get('/:id/bank-account', authjwt, getBankAccount);
router.post('/:id/bank-account', authjwt, setBankAccount);
router.get('/:id/credit-card', authjwt, getCreditCard);
router.post('/:id/credit-card', authjwt, setCreditCard);


function getUserPayments(req, res, next) {
    userPayments(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function setBankAccount(req, res, next) {
    addBankAccount(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

function getBankAccount(req, res, next) {
    userBankAccount(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
function setCreditCard(req, res, next) {
    addCreditCard(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
function getCreditCard(req, res, next) {
    userCreditCard(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}
module.exports = router;