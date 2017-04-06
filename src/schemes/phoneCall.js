const mongoose = require('mongoose');
const constants = require('../constants/constants');

const Schema = mongoose.Schema;

const phoneCallSchema = {
  phoneNumber: {
    type: String,
    required: [true, constants.FIELD_IS_REQUIRED],
    match: /^[0-9]*$/i
  },
  contact_id: { type: Schema.Types.ObjectId, ref: 'Contact' }, //ref to model
  eventTime: {
    type: Date,
    index: true,
    required: [true, constants.FIELD_IS_REQUIRED]
  },
  duration: Number //number of seconds
};

module.exports = new Schema(phoneCallSchema);
