const express = require('express');
const router = express.Router();
const { createDriver, loginDriver, DriverVerifyRefreshTokenAndIssue, updateDriver } = require('../controllers/driver');

router.post('/create', createDriver);
router.post('/login', loginDriver);
router.post('/refresh-token', DriverVerifyRefreshTokenAndIssue);
router.put('/update/:id', updateDriver);

module.exports = router