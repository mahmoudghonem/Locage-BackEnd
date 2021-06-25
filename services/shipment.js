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
        const result = await Shipment.findOne({ _id: shipmentId }).exec();
        return { result: result };
    } catch (error) {
        new CustomError(error.toString());
    }
};

const getPrimary = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (userId != id)
        new CustomError('BAD_REQUEST', 400);

    await findOneUserById(userId);

    try {
        const result = await Shipment.findOne({ userId: userId, primary: true }).exec();
        return { result: result };
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
        const result = await Shipment.find({ userId: userId }).exec();
        return { result: result };
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

    const shipments = await Shipment.find({ userId: userId }).exec();

    if (shipments) {
        if (body.primary == true) {
            await Shipment.updateMany({ userId: userId }, { primary: false }).exec();
        }
    }
    else if (!shipments) body.primary = true;

    body.userId = userId;
    const shipment = new Shipment(body);

    try {
        await shipment.save();
        return { message: "ADDED_SUCCESSFULLY" };
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
        if (body.primary == true) {
            await Shipment.updateMany({ userId: userId }, { primary: false }).exec();
        }
        await Shipment.findByIdAndUpdate(shipmentId, { ...body }).exec();
        return { message: "UPDATED_SUCCESSFULLY" };
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
        return { message: "REMOVED_SUCCESSFULLY" };
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
    getPrimary
};