const customError = require('../functions/errorHandler');

// Check that id is correct and castable
const checkId = (id) => {
    if(id.length > 24 || id.length < 24) customError("UNCASTABLE_OBJECTID", 400)
}

// Check that the body of the request is not empty
const isEmpty = (obj) => {
    if(Object.keys(obj).length === 0 && obj.constructor === Object) customError("BAD_REQUEST", 400);
}

module.exports = {
    checkId,
    isEmpty
}