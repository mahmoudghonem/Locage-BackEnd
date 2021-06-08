const User = require('../../models/user');
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

module.exports = {
    vendorDetails,
    oneVendorDetails,
};