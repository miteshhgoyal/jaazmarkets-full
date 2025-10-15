// middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            valid: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: 'User not found in database',
            });
        }

        // Check if account is active
        if (user.accountStatus === 'suspended' || user.accountStatus === 'closed') {
            return res.status(403).json({
                success: false,
                valid: false,
                message: `Account is ${user.accountStatus}`,
            });
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                valid: false,
                message: 'Token expired',
                expired: true
            });
        }
        return res.status(401).json({
            success: false,
            valid: false,
            message: 'Invalid token'
        });
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // If no roles specified, just check if user is authenticated
        if (roles.length === 0) {
            return next();
        }

        // Check if user has required role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions'
            });
        }

        next();
    };
};
