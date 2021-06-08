const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

const getUserById = async (id) => {
    const user = await User.findById(id).exec();
    if (!user)
        new CustomError('UNAUTHORIZED', 401);
    return user;
};

//check authorization level with auth user (admin access only)
const adminRole = async (req, res, next) => {
    try {
        try {
            const id = req.userId;
            const adminUser = await getUserById(id);
            if (adminUser.role != 'admin')
                new CustomError('UNAUTHORIZED', 401);

            req.user = adminUser;
            next();
        } catch (e) {
            new CustomError('UNAUTHORIZED', 401);
        }
    } catch (e) {
        next(e);
    }
};

//check authorization level with auth user (staff or admin access)
const staffRole = async (req, res, next) => {
    try {
        try {
            const id = req.userId;
            const staffUser = await getUserById(id);
            if (staffUser.role != 'staff' && staffUser.role != 'admin')
                new CustomError('UNAUTHORIZED', 401);

            req.user = staffUser;
            next();
        } catch (e) {
            new CustomError('UNAUTHORIZED', 401);
        }
    } catch (e) {
        next(e);
    }
};

//check authorization level with auth user (vendor access only)
const vendorRole = async (req, res, next) => {
    try {
        try {
            const id = req.userId;
            const vendorUser = await getUserById(id);
            if (vendorUser.role != 'vendor')
                new CustomError('UNAUTHORIZED', 401);

            req.user = vendorUser;
            next();
        } catch (e) {
            new CustomError('UNAUTHORIZED', 401);
        }
    } catch (e) {
        next(e);
    }
};


module.exports = {
    adminRole,
    staffRole,
    vendorRole,
};