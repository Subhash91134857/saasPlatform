const { gEnv } = require('../utils/env.js');

const environment = gEnv('NODE_ENV',"development");
const connectionUrl = gEnv('DB_CONNECTION');
module.exports = {
    [environment]: {
        connectionUri: connectionUrl
    }
};