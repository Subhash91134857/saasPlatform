const { createServer } = require('http');
const { gEnv, normalizePort } = require("./src/utils/env");
const mongoose = require("mongoose")
const config = require('./src/config/db.js');



process.on('uncaughtException', (err) => {
    console.log('Uncaught Excception! Shutting down...');
    console.log(`name: ${err.name} message: ${err.message}`);
    console.log(err);
    process.exit(1);
});




const app = require('./src/app');


//  Get port from environment and store in express
let port = normalizePort(gEnv('PORT', 8080));
app.set('port', port);


// DatabaseUrl
const DB_URL = config[process.env.NODE_ENV || 'development'].connectionUri;

// * Max Attempts For Connection

const MAX_DB_CONNECTION_ATTEMPT = 3;
let dbAttempts = 0;


const server = createServer(app);
// starting redis



// connect to database

const connect = (DB_URL) => {
    mongoose.connect(DB_URL)
        .then(async () => {
            console.log("Connected to database");
        })
        .catch((error) => {
            console.log(error);
        })
}





// start server
const start = async (DB_URL) => {
    mongoose.connection.on('error', () => {
        if (MAX_DB_CONNECTION_ATTEMPT > dbAttempts) {
            console.log('Retrying connection');
            connect(DB_URL);
            dbAttempts += 1;
        } else {
            process.exit(1);
        }
    });
    server.listen(port, () => connect(DB_URL));
};

// event listtenrer fir https server error
const onError = (error) => {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
             console.log(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            port += 1;
            console.log(`${bind} is already in use, trying ${port}`);
            server.listen(port);
            break;
        default:
            throw error;
    }
};





const onListening = () => {
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${address.port}`;
    console.log(` We are live on ${bind}`);
    
}


process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(`error: ${err.name} message: ${err.message}`);
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

//  Establish connection 
start(DB_URL);


server.on('error', onError)
server.on('listening', onListening);