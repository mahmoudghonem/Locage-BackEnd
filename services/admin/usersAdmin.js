const User = require('../../models/user');
const CustomError = require('../../functions/errorHandler');


//get all users details from database to admin dashboard
const usersDetails = async (req, res) => {

    try {
        const users = await User.find({ role: 'user' });
        return res.status(200).json({ users: users });
    } catch (error) {
        new CustomError(error.toString());
    }
};

//get one user details from database to admin dashboard
const oneUserDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.find({ $and: [{ _id: id }, { role: 'user' }] });
        return res.status(200).json({ user: user });
    } catch (error) {
        new CustomError(error.toString());
    }
};

//delete one user from database to admin dashboard
const oneUserRemove = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.remove({ $and: [{ _id: id }, { role: 'user' }] });
        return res.status(200).json({ user: user });
    } catch (error) {
        new CustomError(error.toString());
    }

};
//delete many users from database to admin dashboard 
// TODO: Not very efficient Implementation (Need to do with other way like aggregations)
// const manyUserRemove = async (req, res) => {
//     const userIds = req.body.ids;

//     if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//         new CustomError('EMPTY_BODY', 400);
//     }
//     var myQuery = { $and: [{ _id: { $in: userIds } }, { role: 'user' }] };
//     await User.deleteMany(myQuery).then(result => {
//         return res.status(200).json({ message: "DELETED_SUCCESSFULLY", result: result });
//     }).catch(err => {
//         new CustomError(err.toString());
//     });
// };




module.exports = {
    usersDetails,
    oneUserDetails,
    oneUserRemove,
};