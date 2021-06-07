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
    await User.find({ $and: [{ _id: id }, { role: 'admin' }] }).then(admin => {
        return res.status(200).json({ admin: admin });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get all staff details from database to admin dashboard
const staffDetails = async (req, res) => {
    await User.find({ role: 'staff' }).then(staff => {
        return res.status(200).json({ staff: staff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one staff details from database to admin dashboard
const oneStaffDetails = async (req, res) => {
    const { id } = req.params;
    await User.find({ $and: [{ _id: id }, { role: 'staff' }] }).then(staff => {
        return res.status(200).json({ staff: staff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//make one user account to subAdmin
const makeAccountSubAdmin = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate({ _id: id }, { role: 'staff' }).then(result => {
        return res.status(200).json({ result: result });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get all staff and admins details from database to admin dashboard
const moderatorDetails = async (req, res) => {
    await User.find({ $or: [{ role: 'admin' }, { role: 'staff' }] }).then(moderators => {
        return res.status(200).json({ moderators: moderators });
    }).catch(err => {
        new CustomError(err.toString());
    });
};
//get one from staff or admins details from database to admin dashboard
const oneModeratorDetails = async (req, res) => {
    const { id } = req.params;
    await User.find({ $and: [{ _id: id }, { $or: [{ role: 'admin' }, { role: 'staff' }] }] }).then(staff => {
        return res.status(200).json({ staff: staff });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

module.exports = {
    staffDetails,
    oneStaffDetails,
    makeAccountSubAdmin,
    adminDetails,
    oneAdminDetails,
    moderatorDetails,
    oneModeratorDetails
};