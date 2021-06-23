const User = require('../../models/user');
const CustomError = require('../../functions/errorHandler');

//get all admin details from database to admin dashboard
const adminDetails = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        return { admins: admins };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get one admin details from database to admin dashboard
const oneAdminDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await User.find({ $and: [{ _id: id }, { role: 'admin' }] });
        return { admin: admin };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get all staff details from database to admin dashboard
const staffDetails = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' });
        return { staff: staff };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get one staff details from database to admin dashboard
const oneStaffDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await User.find({ $and: [{ _id: id }, { role: 'staff' }] });
        return { staff: staff };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//make one user account to subAdmin
const makeAccountSubAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.findByIdAndUpdate({ _id: id }, { role: 'staff' });
        return { result: result };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//make one subAdmin account to user
const removeSubAdminRole = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.findByIdAndUpdate({ _id: id }, { role: 'user' });
        return { result: result };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get all staff and admins details from database to admin dashboard
const moderatorDetails = async (req, res) => {

    try {
        const moderators = await User.find({ $or: [{ role: 'admin' }, { role: 'staff' }] });
        return { moderators: moderators };
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get one from staff or admins details from database to admin dashboard
const oneModeratorDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await User.find({ $and: [{ _id: id }, { $or: [{ role: 'admin' }, { role: 'staff' }] }] });
        return { staff: staff };
    } catch (error) {
        new CustomError(error.toString());
    }
};

module.exports = {
    staffDetails,
    oneStaffDetails,
    makeAccountSubAdmin,
    removeSubAdminRole,
    adminDetails,
    oneAdminDetails,
    moderatorDetails,
    oneModeratorDetails
};