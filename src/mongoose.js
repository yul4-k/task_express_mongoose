const mongoose = require('mongoose');
const config = require('./config');
const logger = require("./utils/logger");

logger.log(config.mongodb.uri);
mongoose.connect(config.mongodb.uri);

let db = mongoose.connection;
db.on('error', logger.error.bind(logger, 'connection error:'));

module.exports = mongoose;
