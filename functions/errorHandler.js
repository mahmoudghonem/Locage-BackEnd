const customError = function (errorString, errorCode) {
    const error = new Error(errorString);
    error.statusCode = errorCode || 500;
    throw error;
}
module.exports = customError;