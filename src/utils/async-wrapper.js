const Response = require('./response-handler');
const AppError = require("../utils/app-error")

module.exports = (fn) => async (req, res, next) => {
    try {

        const {
            data,
            statusCode = 200,
            message = 'API executed successfully',
        } = await fn(req, res, next) || {};

        // console.log(data);
        if (!data) {
            throw new AppError("API execution failed", statusCode, true, "API_ERROR");
        }
        Response.sendSuccess(res, data, statusCode, message);
    } catch (err) {
        if (err instanceof AppError) {
            AppError.handle(err, req, res, next);
        } else {
            if (!res.headersSent) {
                next(err);
            }
        }
    }
}