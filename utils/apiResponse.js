/**
 * Function to send a standardized JSON response.
 * @param {Object} res - The response object from Express.
 * @param {Number} statusCode - The HTTP status code (e.g., 200, 400, 500).
 * @param {Boolean} success - Boolean flag indicating whether the request was successful.
 * @param {Object} data - The data to be sent in the response.
 * @param {String} message - Optional message to send in the response.
 */
const apiResponse = (res, statusCode, success, data = null, message = '') => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};

module.exports = apiResponse;
