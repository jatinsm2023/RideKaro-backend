const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_NEW, { expiresIn: '1h' });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_NEW, { expiresIn: '7d' });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_NEW);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};