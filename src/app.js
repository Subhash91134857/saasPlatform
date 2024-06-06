const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize')

const AppError = require('./utils/app-error')
const Response = require('./utils/response-handler');
const Route = require('./route/index')
const { gEnv } = require("../src/utils/env")







const app = express();


app.disable('etag').disable('x-powered-by');



app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}))

app.options(
    '/api',
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
)

// if (gEnv('NODE_ENV') !== 'production') {
//     app.use(requestLogger);
// }

// For securing header
app.use(helmet());

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP, please try after some time'
})
app.use('/api', limiter);




//  Body parser
app.use(express.json({ limit: '100kb' }));

// Url encoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// sanitize data before sending to mongodb
app.use(mongoSanitize());

// secure from cross-site-scripting
app.use(xss());

// pollution prevention
app.use(hpp({
    whitelist: []
}))

// Response compression
app.use(compression());


// app.use('/api', localVariables)

// Intialize routes
Route(app);

//  Handling error for route not found
app.use("*", (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404, true, "ROUTE_NOTE_FOUND"))
})

// Global Error handler
app.use(Response.sendError);

module.exports = app;