var mongoose = require('mongoose');

var PhoneCallSchema = require('../schemes/phoneCall');
var PhoneCallModel = mongoose.model('PhoneCall', PhoneCallSchema, 'phonecalls');
module.exports = PhoneCallModel;