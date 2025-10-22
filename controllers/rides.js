const Ride = require('../models/rides');
const Driver = require('../models/driver');
const Rider = require('../models/rider');

// Create a new ride request
const createRide = async (req, res) => {
  try {
    const {
      rider_id,
      pickup_location,
      drop_location,
      fare,
      distance,
      estimated_time
    } = req.body;

    // Get rider's phone number
    const rider = await Rider.findById(rider_id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const newRide = new Ride({
      rider_id,
      pickup_location,
      drop_location,
      fare,
      distance,
      estimated_time,
      rider_phone: rider.phone_number,
    });

    const savedRide = await newRide.save();
    
    // Populate rider information
    await savedRide.populate('rider_id', 'name phone_number');

    res.status(201).json({
      message: 'Ride created successfully',
      ride: savedRide
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending rides for drivers
const getPendingRides = async (req, res) => {
  try {
    const pendingRides = await Ride.find({ status: 'pending' })
      .populate('rider_id', 'name phone_number')
      .sort({ booking_time: -1 });

    res.status(200).json({
      message: 'Pending rides retrieved successfully',
      rides: pendingRides
    });
  } catch (error) {
    console.error('Get pending rides error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept a ride by driver
const acceptRide = async (req, res) => {
  try {
    const { ride_id } = req.body;
    const { driver_id, driver_phone } = req.body;

    // Check if ride exists and is still pending
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    // Get driver information if driver_id is provided
    let driverPhone = driver_phone;
    if (driver_id && !driver_phone) {
      const driver = await Driver.findById(driver_id);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      driverPhone = driver.phone_number;
    }

    // Update ride with driver information
    const updatedRide = await Ride.findByIdAndUpdate(
      ride_id,
      {
        driver_id,
        driver_phone: driverPhone,
        status: 'accepted',
        accepted_time: new Date()
      },
      { new: true }
    ).populate('rider_id', 'name phone_number')
     .populate('driver_id', 'name phone_number vehicle_type');
    console.log(updatedRide);
    res.status(200).json({
      message: 'Ride accepted successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get rides for a specific rider
const getRiderRides = async (req, res) => {
  try {
    const { rider_id } = req.params;

    const rides = await Ride.find({ rider_id })
      .populate('driver_id', 'name phone_number vehicle_type')
      .sort({ booking_time: -1 });

    res.status(200).json({
      message: 'Rider rides retrieved successfully',
      rides
    });
  } catch (error) {
    console.error('Get rider rides error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get rides for a specific driver
const getDriverRides = async (req, res) => {
  try {
    const { driver_id } = req.params;
    
    const rides = await Ride.find({ driver_id })
      .populate('rider_id', 'name phone_number')
      .sort({ booking_time: -1 });

    res.status(200).json({
      message: 'Driver rides retrieved successfully',
      rides
    });
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { ride_id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find and update the ride
    const updatedRide = await Ride.findByIdAndUpdate(
      ride_id,
      { 
        status,
        ...(status === 'completed' && { completed_time: new Date() })
      },
      { new: true }
    ).populate('rider_id', 'name phone_number')
     .populate('driver_id', 'name phone_number vehicle_type');

    if (!updatedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json({
      message: 'Ride status updated successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ride by ID
const getRideById = async (req, res) => {
  try {
    const { ride_id } = req.params;

    const ride = await Ride.findById(ride_id)
      .populate('rider_id', 'name phone_number')
      .populate('driver_id', 'name phone_number vehicle_type');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    console.log(ride);
    res.status(200).json({
      message: 'Ride retrieved successfully',
      ride
    });
  } catch (error) {
    console.error('Get ride by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRide,
  getPendingRides,
  acceptRide,
  getRiderRides,
  getDriverRides,
  updateRideStatus,
  getRideById
};