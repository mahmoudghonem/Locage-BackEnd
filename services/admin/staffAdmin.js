const User = require('../../models/user');
const CustomError = require('../../functions/errorHandler');

//get all admin details from database to admin dashboard
const adminDetails = async (req, res) => {
    await User.find({ role: 'admin' }).then(admins => {
        return res.status(200).json({ admins: admins });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one admin details from database to admin dashboard
const oneAdminDetails = async (req, res) => {
    const { id } = req.params;
    await User.findById({ $and: [{ _id: id }, { role: 'admin' }] }).then(admin => {
        return res.status(200).json({ admin: admin });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get all stuff details from database to admin dashboard
const stuffDetails = async (req, res) => {
    await User.find({ role: 'stuff' }).then(stuff => {
        return res.status(200).json({ stuff: stuff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one stuff details from database to admin dashboard
const oneStuffDetails = async (req, res) => {
    const { id } = req.params;
    await User.findById({ $and: [{ _id: id }, { role: 'stuff' }] }).then(stuff => {
        return res.status(200).json({ stuff: stuff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get all stuff and admins details from database to admin dashboard
const moderatorDetails = async (req, res) => {
    await User.find({ $or: [{ role: 'admin' }, { role: 'stuff' }] }).then(moderators => {
        return res.status(200).json({ moderators: moderators });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one from stuff or admins details from database to admin dashboard
const oneModeratorDetails = async (req, res) => {
    const { id } = req.params;
    await User.findById({ $and: [{ _id: id }, { $or: [{ role: 'admin' }, { role: 'stuff' }] }] }).then(stuff => {
        return res.status(200).json({ stuff: stuff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

module.exports = {
    stuffDetails,
    oneStuffDetails,
    adminDetails,
    oneAdminDetails,
    moderatorDetails,
    oneModeratorDetails
};