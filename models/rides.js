const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
    required: true,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  pickup_location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  drop_location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  fare: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number, // in kilometers
    default: 0,
  },
  estimated_time: {
    type: Number, // in minutes
    default: 0,
  },
  booking_time: {
    type: Date,
    default: Date.now,
  },
  accepted_time: {
    type: Date,
    default: null,
  },
  completed_time: {
    type: Date,
    default: null,
  },
  rider_phone: {
    type: String,
    required: true,
  },
  driver_phone: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);