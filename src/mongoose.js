const config = require('./config');
const mongoose = require('mongoose');

// Лучше не использовать console напрямую.
// Т.к. всегда есть шанс поменять логгер на, например, отсыл данных на внешний сервак
// и переделывать весь app будет очень затратно
console.log(config.mongodb.uri);
mongoose.connect(config.mongodb.uri);

let db = mongoose.connection;
// тот же комент про логгера
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;
