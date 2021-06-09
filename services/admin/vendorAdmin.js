/* eslint-disable no-undef */
const User = require('../../models/user');
const Store = require('../../models/store');
const nodemailer = require('nodemailer');
const CustomError = require('../../functions/errorHandler');

//get all vendor details from database to admin dashboard
const vendorDetails = async (req, res) => {
    await User.find({ role: 'vendor' }).then(vendors => {
        return res.status(200).json({ vendors: vendors });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one vendor details from database to admin dashboard
const oneVendorDetails = async (req, res) => {
    const { id } = req.params;
    await User.find({ $and: [{ _id: id }, { role: 'vendor' }] }).then(vendor => {
        return res.status(200).json({ vendor: vendor });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get all Stores details from database to admin dashboard
const storeDetails = async (req, res) => {
    await Store.find().then(stores => {
        return res.status(200).json({ stores: stores });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one Store details from database to admin dashboard
const oneStoreDetails = async (req, res) => {
    const { id } = req.params;
    await Store.find({ _id: id }).then(store => {
        return res.status(200).json({ store: store });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//Approve one Store 
const approveStore = async (req, res) => {
    const { id } = req.params;
    var store;
    try {
        store = await Store.findByIdAndUpdate(id, { statusCode: 'accepted' }).exec();
    } catch (err) {
        new CustomError(err.toString());
    }
    try {
        await User.findByIdAndUpdate(store.userId, { role: 'vendor' }).exec();
    } catch (err) {
        new CustomError(err.toString());
    }
    const smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        port: process.env.SENDGRID_PORT,
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        }
    });
    const mailOptions = {
        to: store.email,
        from: process.env.MAIL_FROM,
        subject: 'Locage Store',
        text: 'You are receiving this because your store creation was Approved.\n\n'
    };
    await smtpTransport.sendMail(mailOptions).then(() => {
        return res.status(200).json({ message: "APPROVED" });
    }).catch((err) => {
        new CustomError(err.toString());
    });
};
//Disapprove one Store
const disapproveStore = async (req, res) => {
    const { id } = req.params;
    let store;
    try {
        store = await Store.findByIdAndRemove(id).exec();
    } catch (err) {
        new CustomError(err.toString());
    }

    const smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        port: process.env.SENDGRID_PORT,
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        }
    });
    const mailOptions = {
        to: store.email,
        from: process.env.MAIL_FROM,
        subject: 'Locage Store',
        text: 'You are receiving this because your store creation was declined.\n\n' +
            'Please Check the Requirements again\n\n'
    };
    await smtpTransport.sendMail(mailOptions).then(() => {
        return res.status(200).json({ message: "DISAPPROVED" });
    }).catch((err) => {
        new CustomError(err.toString());
    });
};

module.exports = {
    vendorDetails,
    oneVendorDetails,
    storeDetails,
    oneStoreDetails,
    approveStore,
    disapproveStore
};