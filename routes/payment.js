const express = require('express');
const router = express.Router();
const authjwt = require('../middlewares/authjwt');
const { userPayments, addBankAccount, getBankAccount, addCreditCard, getCreditCard, updateBankAccount, updateCreditCard, deleteBankAccount, deleteCreditCard } = require('../services/payment');

router.get('/:id', authjwt, getUserPayments);

router.route('/:id/bank-account')
    .get(authjwt, returnBankAccount)
    .post(authjwt, setBankAccount)
    .patch(authjwt, editBankAccount)
    .delete(authjwt, removeBankAccount);

router.route('/:id/credit-card')
    .get(authjwt, returnCreditCard)
    .post(authjwt, setCreditCard);
    
router.route('/:id/credit-card/:cardId')
    .patch(authjwt, editCreditCard)
    .delete(authjwt, removeCreditCard);

function getUserPayments(req, res, next) {
    userPayments(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function setBankAccount(req, res, next) {
    addBankAccount(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function returnBankAccount(req, res, next) {
    getBankAccount(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function editBankAccount(req, res, next) {
    updateBankAccount(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}
function removeBankAccount(req, res, next) {
    deleteBankAccount(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function setCreditCard(req, res, next) {
    addCreditCard(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function returnCreditCard(req, res, next) {
    getCreditCard(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

function editCreditCard(req, res, next) {
    updateCreditCard(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}
function removeCreditCard(req, res, next) {
    deleteCreditCard(req, res, next).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = router;