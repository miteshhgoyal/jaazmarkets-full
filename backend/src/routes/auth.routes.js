// backend/src/routes/auth.js
import express from 'express';
import User from '../models/User.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';
import {
    sendPasswordResetEmail,
    sendRegistrationEmail,
    generateOTP,
    generateTradingPassword,
    generateAccountNumber
} from '../services/emailService.js';

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const sanitizeUser = (user) => {
    return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        walletBalance: user.walletBalance,
        currency: user.currency,
        twoFactorEnabled: user.twoFactorEnabled,
        tradingAccounts: user.tradingAccounts,
    };
};

// ============================================
// PUBLIC ROUTES
// ============================================

// SIGNUP - Register new user
router.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName, mobile, referralCode } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Email, password, first name, and last name are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, ...(mobile ? [{ phoneNumber: mobile }] : [])],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or phone already exists",
            });
        }

        // ===== REFERRAL HANDLING =====
        let referrerId = null;
        if (referralCode) {
            const referrer = await User.findOne({ email: referralCode });
            if (referrer) {
                referrerId = referrer._id;
                // Increment referrer's total referrals
                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { totalReferrals: 1 },
                });
            }
        }

        // ===== AUTO-GENERATE TRADING CREDENTIALS =====
        const tradingPassword = generateTradingPassword();
        const accountNumber = generateAccountNumber();

        // Create new user with all fields
        const user = new User({
            email: email.toLowerCase(),
            password,
            tradingPassword,
            accountNumber,
            firstName,
            lastName,
            phoneNumber: mobile,
            role: "user",
            accountStatus: "pending",
            isVerified: false,
            referredBy: referrerId,
        });

        await user.save();

        // ===== SEND REGISTRATION EMAIL WITH ALL CREDENTIALS =====
        try {
            await sendRegistrationEmail({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                portalPassword: password,              // Send plain text for email
                tradingPassword: tradingPassword,      // Send plain text for email (before hash)
                accountNumber: accountNumber,
                currency: user.currency,
            });
            console.log(`Registration email sent to ${user.email}`);
        } catch (emailError) {
            console.error('Registration email failed:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Check your email for complete login details.",
            data: {
                email: user.email,
                accountNumber: accountNumber,
                message: "Trading credentials sent to your email"
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
});

// SIGNIN - Login
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Find user by email and include password field
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check account status
        if (user.accountStatus === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact support.',
            });
        }

        if (user.accountStatus === 'closed') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been closed. Please contact support.',
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Return success with tokens and user data
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
                user: sanitizeUser(user),
            },
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
        });
    }
});

// REFRESH TOKEN - Get new access token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required',
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check account status
        if (user.accountStatus !== 'active' && user.accountStatus !== 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Account is not active',
            });
        }

        // Generate new tokens
        const tokens = generateTokens(user);

        res.json({
            success: true,
            data: tokens,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
        });
    }
});

// FORGOT PASSWORD - Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({
                success: true,
                message: 'If an account exists, a reset code has been sent',
            });
        }

        // Generate OTP
        const otp = user.generateResetOTP();
        await user.save();

        // Send OTP via email
        try {
            await sendPasswordResetEmail(email, otp, user.firstName || 'User');
            console.log(`Password reset code sent to ${email}`);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Still return success to prevent enumeration
        }

        res.json({
            success: true,
            message: 'Password reset code sent to your email',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process request',
        });
    }
});

// VERIFY RESET OTP
router.post('/verify-reset-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordOTP: otp,
            resetPasswordOTPExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code',
            });
        }

        res.json({
            success: true,
            message: 'OTP verified successfully',
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed',
        });
    }
});

// RESET PASSWORD - Set new password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordOTP: otp,
            resetPasswordOTPExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code',
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed',
        });
    }
});

// ============================================
// PROTECTED ROUTES
// ============================================

// VERIFY TOKEN - Check if token is valid
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: 'User not found',
            });
        }

        if (user.accountStatus === 'suspended' || user.accountStatus === 'closed') {
            return res.status(403).json({
                success: false,
                valid: false,
                message: `Account is ${user.accountStatus}`,
            });
        }

        res.json({
            success: true,
            valid: true,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            valid: false,
            message: 'Token verification failed',
        });
    }
});

// LOGOUT - Invalidate tokens
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // TODO: Add refresh token to blacklist/invalidate in database if needed
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
        });
    }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('tradingAccounts')
            .populate('referredBy', 'firstName lastName email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
        });
    }
});

// UPDATE PROFILE
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            country,
            state,
            city,
            address,
            postalCode,
        } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update allowed fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (country) user.country = country;
        if (state) user.state = state;
        if (city) user.city = city;
        if (address) user.address = address;
        if (postalCode) user.postalCode = postalCode;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
        });
    }
});

// CHANGE PASSWORD
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required',
            });
        }

        const user = await User.findById(req.user.userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
        });
    }
});

export default router;
