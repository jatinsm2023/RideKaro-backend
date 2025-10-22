const express = require('express');
const router = express.Router();
const {
  createRide,
  getPendingRides,
  acceptRide,
  getRiderRides,
  getDriverRides,
  updateRideStatus,
  getRideById
} = require('../controllers/rides');

// Create a new ride
router.post('/create', createRide);

// Get all pending rides (for drivers)
router.get('/pending', getPendingRides);

// Accept a ride (PUT request with ride_id in URL)
router.post('/accept', acceptRide);

// Get rides for a specific rider
router.get('/rider/:rider_id', getRiderRides);

// Get rides for a specific driver
router.get('/driver/:driver_id', getDriverRides);

// Update ride status
router.put('/:ride_id/status', updateRideStatus);

// Get ride by ID
router.get('/:ride_id', getRideById);

module.exports = router;