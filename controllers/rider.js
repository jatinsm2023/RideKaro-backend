const Rider = require('../models/rider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/accessToken');

// create user
module.exports.createRider = async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;
     
        if (!name || !email || !password || !phone_number) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }   

        const existingRider = await Rider.findOne({ email });
        if (existingRider) {
            return res.status(400).json({ message: 'Rider already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRider = new Rider({ name, email, password: hashedPassword, phone_number });
        await newRider.save();
        res.status(201).json({ message: 'Rider created successfully', rider: newRider });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

module.exports.loginRider = async (req, res) => {   
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const rider = await Rider.findOne({ email });
        if (!rider) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, rider.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create tokens
        const tokenRider = { id: rider._id };
        const accessToken = generateAccessToken(tokenRider);
        const refreshToken = generateRefreshToken(tokenRider);

        // For mobile apps, return tokens in response body
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone_number: rider.phone_number
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

module.exports.verifyRefreshTokenAndIssue = async (req, res) => {
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
        
        // Check if rider exists
        const rider = await Rider.findById(decoded.id);
        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }
        
        // Generate new access token
        const tokenRider = { id: rider._id };
        const accessToken = generateAccessToken(tokenRider);
        
        return res.status(200).json({
            accessToken,
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone_number: rider.phone_number
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};