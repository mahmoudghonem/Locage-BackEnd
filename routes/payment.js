const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { userPayments, addBankAccount, userBankAccount, addCreditCard, userCreditCard, updateBankAccount, updateCreditCard } = require('../services/payment');

router.get('/:id', authjwt, getUserPayments);

router.route('/:id/bank-account')
    .get(authjwt, getBankAccount)
    .post(authjwt, setBankAccount)
    .patch(authjwt, editBankAccount);

router.route('/:id/credit-card')
    .get(authjwt, getCreditCard)
    .post(authjwt, setCreditCard);
router.patch('/:id/credit-card/:cardId', authjwt, editCreditCard);

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

function editBankAccount(req, res, next) {
    updateBankAccount(req, res, next).then((result) => {
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

function editCreditCard(req, res, next) {
    updateCreditCard(req, res, next).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;