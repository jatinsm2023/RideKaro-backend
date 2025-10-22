const express = require('express');
const router = express.Router();
const { createRider, loginRider, verifyRefreshTokenAndIssue } = require('../controllers/rider');

// Route to create a new rider
router.post('/create', createRider);

// Route to login a rider    
router.post('/login', loginRider);

router.post('/refresh-token', verifyRefreshTokenAndIssue);

module.exports = router;