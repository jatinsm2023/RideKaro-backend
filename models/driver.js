const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  vehicle_type: {
    type: Object,
    default: {},
  },
  longitude: {
    type: Number,
    required: true,
    default: 0,
  },
  latitude: {
    type: Number,
    required: true,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  min_available_time: {
    type: String,
    default: '00:00',
  },
  max_available_time: {
    type: String,
    default: '23:59',
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
