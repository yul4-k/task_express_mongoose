var mongoose = require('mongoose');
var constants = require('../constants/constants')

var Schema = mongoose.Schema;

var contactSchema = {
  firstName: {
    type: String,
    index: true,
  },
  lastName: {
    type: String
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    required: [true, constants.FIELD_IS_REQUIRED],
    match: /^[0-9]*$/i
  },
  modificationDate: Date
};

module.exports = new Schema(contactSchema);
module.exports.contactSchema = contactSchema;
