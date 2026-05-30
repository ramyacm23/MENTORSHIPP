const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware — verifies JWT from Authorization header
 * and attaches the user document to req.user.
 * Supports both custom JWT tokens (from /signup, /login) and
 * falls back to email-based lookup for Firebase ID tokens.
 */
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Try verifying as a custom JWT first
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (jwtError) {
            // If custom JWT verification fails, attempt to decode the token
            // payload to extract the email (for Firebase ID tokens)
            try {
                const payload = JSON.parse(
                    Buffer.from(token.split('.')[1], 'base64').toString()
                );
                if (payload.email) {
                    decoded = { email: payload.email };
                } else {
                    return res.status(401).json({ message: 'Invalid token' });
                }
            } catch {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        // Look up user by userId (custom JWT) or email (Firebase token)
        let user;
        if (decoded.userId) {
            user = await User.findById(decoded.userId).select('-password');
        } else if (decoded.email) {
            user = await User.findOne({ email: decoded.email }).select('-password');
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticateUser;
