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
    const id = req.userId;
    const adminUser = await getUserById(id);
    if (adminUser.role != 'admin')
        new CustomError('UNAUTHORIZED', 401);

    req.user = adminUser;
    next();
};

//check authorization level with auth user (stuff or admin access)
const stuffRole = async (req, res, next) => {
    const id = req.userId;
    const stuffUser = await getUserById(id);
    if (stuffUser.role != 'stuff' || stuffUser.role != 'admin')
        new CustomError('UNAUTHORIZED', 401);

    req.user = stuffUser;
    next();
};

//check authorization level with auth user (vendor access only)
const vendorRole = async (req, res, next) => {
    const id = req.userId;
    const vendorUser = await getUserById(id);
    if (vendorUser.role != 'vendor')
        new CustomError('UNAUTHORIZED', 401);

    req.user = vendorUser;
    next();
};


module.exports = {
    adminRole,
    stuffRole,
    vendorRole,
};