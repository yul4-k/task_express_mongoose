const mongoose = require('mongoose');
const constants = require('../constants/constants')

const Schema = mongoose.Schema;

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
