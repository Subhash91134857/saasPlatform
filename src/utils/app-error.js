const Response = require("../utils/response-handler");

class AppError extends Error {
    constructor(message, statusCode, isOperational = true, errorCode = 'UNKNOWN_ERROR') {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        this.isFunctional = true;
        this.errorCode = errorCode;

        // Ensure the error name is the class name
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }

    static handle(error, req, res, next) {
        if (error instanceof AppError) {
            //  Handle App error instances
            if (AppError.isFrontendRequest(req)) {
                // If it is frontend request, respond with a user-friendly message
                console.log("Front-end request");
                Response.sendError(error, req, res, next)
            } else {
                // if it is a backend request,respond with a detailed error object
                res.status(error.statusCode).json({
                    status: error.status,
                    error: {
                        message: error.message,
                        isOpertaional: error.isOperational,
                        errorCode: error.errorCode,
                        stack: error.stack
                    }
                })
            }
        }
    }

    static isFrontendRequest(req) {
        const userAgent = req.headers['user-agent'];
        const referer = req.headers.referer;

        // Check for common indicators of search engine crawlers
        const isSearchEngineBot =
            userAgent &&
            (userAgent.includes('bot') || userAgent.includes('crawl') || userAgent.includes('spider')) ||
            referer === 'https://www.google.com/';

        // Check if it's a common browser user agent
        const isCommonBrowser =
            userAgent &&
            (userAgent.includes('Mozilla') ||
                userAgent.includes('Chrome') ||
                userAgent.includes('Safari') ||
                userAgent.includes('Edge') ||
                userAgent.includes('Firefox'));

        // Return true if it's not identified as a search engine bot or a common browser
        return !isSearchEngineBot && isCommonBrowser;
    }
}

module.exports = AppError;