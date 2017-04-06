var mongoose = require('mongoose'); // лучше использовать модуль ./mongoose

// мне кажеться лучще схему объявлять здесь, а не выносить в отдельный модуль
var PhoneCallSchema = require('../schemes/phoneCall');
var PhoneCallModel = mongoose.model('PhoneCall', PhoneCallSchema, 'phonecalls');
module.exports = PhoneCallModel;