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

    try {
        const result = await PaymentMethod.aggregate([{
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
        ]);
        return res.status(200).json({ result: result });
    } catch (error) {
        new CustomError(error.toString());
    }

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

    try {
        const result = await bankAccount.save();
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }

};

const getBankAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    try {
        const result = await PaymentMethod.aggregate([{
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
        }]);

        return res.status(200).json({ result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const updateBankAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { body } = req;

    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    const bankAccount = await BankAccount.findOne({ paymentId: paymentMethod.id }).exec();

    if (!bankAccount)
        new CustomError('NOT_FOUND', 404);


    try {
        const result = await BankAccount.findOneAndUpdate({ _id: bankAccount._id }, body);
        return res.status(200).json({ message: "UPDATED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }

};

const deleteBankAccount = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;

    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    const bankAccount = await BankAccount.findOne({ paymentId: paymentMethod.id }).exec();

    if (!bankAccount)
        new CustomError('NOT_FOUND', 404);

    try {
        const result = await BankAccount.findOneAndRemove({ _id: bankAccount._id });
        return res.status(200).json({ message: "DELETED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
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

    try {
        const result = await creditCard.save();
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }

};

const getCreditCard = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    try {
        const result = await PaymentMethod.aggregate([{
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
        }]);
        return res.status(200).json({ result: result });
    } catch (error) {
        new CustomError(error.toString());
    }


};

const updateCreditCard = async (req, res) => {
    const userId = req.userId;
    const { id, cardId } = req.params;
    const { body } = req;

    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    const creditCard = await CreditCard.findOne({ _id: cardId, paymentId: paymentMethod.id }).exec();
    if (!creditCard)
        new CustomError('NOT_FOUND', 404);


    try {
        const result = await CreditCard.findOneAndUpdate({ _id: cardId }, body);
        return res.status(200).json({ message: "UPDATED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const deleteCreditCard = async (req, res) => {
    const userId = req.userId;
    const { id, cardId } = req.params;

    if (userId != id)
        new CustomError('BAD_REQUEST', 400);
    await findOneUserById(userId);

    const paymentMethod = await findOneUserPaymentMethodById(id);
    const creditCard = await CreditCard.findOne({ _id: cardId, paymentId: paymentMethod.id }).exec();
    if (!creditCard)
        new CustomError('NOT_FOUND', 404);

    try {
        const result = await CreditCard.findOneAndRemove({ _id: cardId });
        return res.status(200).json({ message: "DELETED_SUCCESSFULLY", result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
};


module.exports = {
    userPayments,
    addBankAccount,
    getBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addCreditCard,
    getCreditCard,
    updateCreditCard,
    deleteCreditCard
};