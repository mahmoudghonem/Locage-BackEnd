const customError = (errorString, errorCode) => {
    const error = new Error(errorString);
    error.statusCode = errorCode;
    throw error;
}
module.exports = customError;