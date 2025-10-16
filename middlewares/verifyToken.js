const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token found, check cookies as fallback
    const cookieToken = req.cookies?.access_token;
    
    if (!token && !cookieToken) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token || cookieToken, process.env.JWT_SECRET_NEW);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};