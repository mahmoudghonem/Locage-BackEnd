const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const PaymentMethod = require('../models/paymentMethods');
const BankAccount = require('../models/bankAccount');
const CreditCard = require('../models/creditCard');
const CustomError = require('../functions/errorHandler');
const User = require('../models/user');

//Function to query user by email from database
// const findOneUserByEmail = async (email) => {
//     const loadedUser = await User.findOne({ email: email }).exec();
//     if (!loadedUser)
//         new CustomError('USER_NOT_FOUND', 404);
//     return loadedUser;
// };

//Function to query user by id from database
const findOneUserById = async (id) => {
    const loadedUser = await User.findOne({ _id: id }).exec();
    if (!loadedUser)
        new CustomError('USER_NOT_FOUND', 404);
    return loadedUser;
};

//Function to query user paymentMethod by id from database
const findOneUserPaymentMethodById = async (id) => {
    return await PaymentMethod.findOne({ userId: id }).exec();
};

const userPayments = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    await PaymentMethod.aggregate([{
        $match: { userId: ObjectId(userId) }
    }, {
        $group: {
            _id: '$_id',
        }
    }, {
        $lookup: {
            from: 'bankaccounts',
            localField: '_id',
            foreignField: 'paymentId',
            as: 'bankaccount'
        }
    }, {
        $lookup: {
            from: 'creditcards',
            localField: '_id',
            foreignField: 'paymentId',
            as: 'creditcard'
        }
    }
    ]).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString(), 400);
    });
};

const addBankAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { body } = req;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    const bankAccountCheck = await BankAccount.findOne({ paymentId: paymentMethod.id });

    if (bankAccountCheck)
        new CustomError('ALREADY_ONE_EXIST', 400);

    body.paymentId = paymentMethod.id;
    const bankAccount = new BankAccount(body);
    await bankAccount.save().then((result) => {
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY", result: result });
    }).catch(err => {
        new CustomError(err.toString(), 400);
    });

};

const userBankAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    await PaymentMethod.aggregate([{
        $match: { userId: ObjectId(userId) }
    }, {
        $group: {
            _id: '$_id',
        }
    }, {
        $lookup: {
            from: 'bankaccounts',
            localField: '_id',
            foreignField: 'paymentId',
            as: 'bankaccount'
        }
    }]).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString(), 400);
    });
};

const addCreditCard = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { body } = req;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    body.paymentId = paymentMethod.id;
    const creditCard = new CreditCard(body);
    await creditCard.save().then((result) => {
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY", result: result });
    }).catch(err => {
        new CustomError(err.toString(), 400);
    });

};
const userCreditCard = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    await PaymentMethod.aggregate([{
        $match: { userId: ObjectId(userId) }
    }, {
        $group: {
            _id: '$_id',
        }
    }, {
        $lookup: {
            from: 'creditcards',
            localField: '_id',
            foreignField: 'paymentId',
            as: 'creditcard'
        }
    }]).then((result) => {
        return res.status(200).json({ result: result });
    }).catch((err) => {
        new CustomError(err.toString(), 400);
    });
};
module.exports = {
    userPayments,
    addBankAccount,
    addCreditCard,
    userBankAccount,
    userCreditCard
};