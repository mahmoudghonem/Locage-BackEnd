const Order = require('../models/order');
const customError = require('../functions/errorHandler');


const getOrders = async () => {
    try{
        return await Order.find();
    } catch(error){
        return customError(error.toString(), 500);
    }
}


module.exports = {
    getOrders
}