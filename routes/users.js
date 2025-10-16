const express = require('express');
const router = express.Router();
const { createUser, loginUser, verifyRefreshTokenAndIssue } = require('../controllers/users');

// Route to create a new user
router.post('/create', createUser);

// Route to login a user    
router.post('/login', loginUser);

router.post('/refresh-token', verifyRefreshTokenAndIssue);

module.exports = router;