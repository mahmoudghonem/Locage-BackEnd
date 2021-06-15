const Shipment = require('../models/shipment');
const User = require('../models/user');
const CustomError = require('../functions/errorHandler');

//Function to query user by id from database
const findOneUserById = async (id) => {
    const loadedUser = await User.findOne({ _id: id }).exec();
    if (!loadedUser)
        new CustomError('UNAUTHORIZED', 401);

    return loadedUser;
};

const getOneUserShipment = async (req, res) => {
    const { id, shipmentId } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    try {
        const result = await Shipment.findOne({ _id: shipmentId });
        return res.status(200).json({ result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const userShipments = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    try {
        const result = await Shipment.find({ userId: userId });
        return res.status(200).json({ result: result });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const createShipment = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    body.userId = userId;
    const shipment = new Shipment(body);

    try {
        await shipment.save();
        return res.status(200).json({ message: "ADDED_SUCCESSFULLY" });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const updateShipment = async (req, res) => {
    const { id, shipmentId } = req.params;
    const body = req.body;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);
    try {
        await Shipment.findByIdAndUpdate(shipmentId, { ...body });
        return res.status(200).json({ message: "UPDATED_SUCCESSFULLY" });
    } catch (error) {
        new CustomError(error.toString());
    }
};

const removeShipment = async (req, res) => {
    const { id, shipmentId } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);
    try {
        await Shipment.findByIdAndRemove(shipmentId);
        return res.status(200).json({ message: "REMOVED_SUCCESSFULLY" });
    } catch (error) {
        new CustomError(error.toString());
    }
};


module.exports = {
    createShipment,
    updateShipment,
    removeShipment,
    userShipments,
    getOneUserShipment,
};