const config = require('./config');
const mongoose = require('mongoose');

console.log(config.mongodb.uri);
mongoose.connect(config.mongodb.uri);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;
