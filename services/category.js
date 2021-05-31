const Category = require('../models/catogry');


const retrieveAllCategories = async () => {
    try{
        return await Category.find();
    } catch(error) {
        console.log(error);
        return error;
    }
}

const createCategory = async () => {

}


module.exports = {
    retrieveAllCategories,
}