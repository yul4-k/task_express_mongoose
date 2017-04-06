var mongoose = require('../mongoose');

var ContactSchema = require('../schemes/contact');
var ContactModel = mongoose.model('Contact', ContactSchema, 'contacts');

module.exports = ContactModel;
