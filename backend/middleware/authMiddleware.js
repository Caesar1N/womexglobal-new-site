const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token's ID and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next function
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ... (keep the existing 'protect' function) ...

const admin = (req, res, next) => {
    // We check if req.user was set by the 'protect' middleware and if the user is an admin
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Add 'admin' to the exports
module.exports = { protect, admin };
