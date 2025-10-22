const Driver = require('../models/driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/accessToken');


module.exports.createDriver = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new driver
        const driver = new Driver({
            name,
            email,
            phone_number,
            password: hashedPassword
        });

        await driver.save();

        res.status(201).json({ message: 'Driver created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

module.exports.loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if driver exists
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, driver.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create tokens
        const tokenDriver = { id: driver._id };
        const accessToken = generateAccessToken(tokenDriver);
        const refreshToken = generateRefreshToken(tokenDriver);

        // For mobile apps, return tokens in response body
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            driver: {
                id: driver._id,
                name: driver.name,
                email: driver.email,
                phone_number: driver.phone_number,
                vehicle_type: driver.vehicle_type,
                longitude: driver.longitude,
                latitude: driver.latitude,
                available: driver.available,
                min_available_time: driver.min_available_time,
                max_available_time: driver.max_available_time,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

module.exports.DriverVerifyRefreshTokenAndIssue = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        
        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        
        // Check if driver exists
        const driver = await Driver.findById(decoded.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        
        // Generate new access token
        const tokenDriver = { id: driver._id };
        const accessToken = generateAccessToken(tokenDriver);
        
        return res.status(200).json({   
            accessToken,
            driver: {
                id: driver._id,
                name: driver.name,
                email: driver.email,
                phone_number: driver.phone_number,
                vehicle_type: driver.vehicle_type,
                longitude: driver.longitude,
                latitude: driver.latitude,
                available: driver.available,
                min_available_time: driver.min_available_time,
                max_available_time: driver.max_available_time,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};
module.exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body);
        // Check if driver exists
        const driver = await Driver.findById(id);
   
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (key !== '_id' && key !== 'password') {
                driver[key] = req.body[key];
            }
        });

        await driver.save();

        res.status(200).json({ message: 'Driver updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};
