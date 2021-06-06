const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

//get all users details from database to admin dashboard
const usersDetails = async (req, res) => {
    await User.find({ role: 'user' }).then(users => {
        return res.status(200).json({ users: users });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

//get one user details from database to admin dashboard
const oneUserDetails = async (req, res) => {
    const { id } = req.params;
    await User.findById({ $and: [{ _id: id }, { role: 'user' }] }).then(user => {
        return res.status(200).json({ user: user });
    }).catch(err => {
        new CustomError(err.toString());
    });
};

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
    await User.findById({ $and: [{ _id: id }, { role: 'vendor' }] }).then(vendor => {
        return res.status(200).json({ vendor: vendor });
    }).catch(err => {
        new CustomError(err.toString());
    });
};


module.exports = {
    usersDetails,
    oneUserDetails,
    stuffDetails,
    oneStuffDetails,
    vendorDetails,
    oneVendorDetails,
    adminDetails,
    oneAdminDetails,
    moderatorDetails,
    oneModeratorDetails
};