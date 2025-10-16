const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/accessToken');

// create user
module.exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
     
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create tokens
        const tokenUser = { id: user._id };
        const accessToken = generateAccessToken(tokenUser);
        const refreshToken = generateRefreshToken(tokenUser);

        // For mobile apps, return tokens in response body
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
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
        
        // Check if user exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Generate new access token
        const tokenUser = { id: user._id };
        const accessToken = generateAccessToken(tokenUser);
        
        return res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error' });
    }
};