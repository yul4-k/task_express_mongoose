var mongoose = require('mongoose');

var ContactSchema = require('../schemes/contact');
ContactSchema.pre('save', function (next) {
  now = new Date();
  if (!this.modificationDate) {
    this.modificationDate = now;
  }
  next();
});

var ContactModel = mongoose.model('Contact', ContactSchema, 'contacts');

module.exports = ContactModel;
