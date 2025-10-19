// backend/src/routes/auth.js
import express from 'express';
import User from '../models/User.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';
import {
    sendPasswordResetEmail,
    sendRegistrationEmail,
    generateOTP,

    sendEmailVerificationOTP,

} from '../services/emailService.js';

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique User ID
 * Format: JZM + 8 random digits
 * Example: JZM34892384
 */
const generateUserId = async () => {
    const prefix = 'JZM';
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
        const userId = `${prefix}${randomDigits}`;

        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            return userId;
        }
        attempts++;
    }

    throw new Error('Failed to generate unique User ID after multiple attempts');
};

/**
 * Generate unique Account Number with proper collision handling
 */
const generateUniqueAccountNumber = async () => {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const accountNumber = 'JM' + Math.floor(10000000 + Math.random() * 90000000);

        const existingAccount = await User.findOne({ accountNumber });
        if (!existingAccount) {
            return accountNumber;
        }
        attempts++;
    }

    throw new Error('Failed to generate unique Account Number after multiple attempts');
};

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
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
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        accountNumber: user.accountNumber,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        walletBalance: user.walletBalance,
        currency: user.currency,
        twoFactorEnabled: user.twoFactorEnabled,
        tradingAccounts: user.tradingAccounts,
        referralCode: user.referralCode,
    };
};

// ============================================
// STEP 1: SIGNUP - Check user, create & send OTP
// ============================================
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

        // ===== CHECK IF USER EXISTS =====
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        }).select('+emailVerificationOTP +emailVerificationOTPExpiry');

        // If user exists and is already verified - reject signup
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists. Please login instead.",
                userExists: true,
                isVerified: true
            });
        }

        // If user exists but NOT verified - resend OTP and update data
        if (existingUser && !existingUser.isVerified) {
            // Check if phone number is being changed and conflicts with another user
            if (mobile && mobile !== existingUser.phoneNumber) {
                const phoneConflict = await User.findOne({
                    phoneNumber: mobile,
                    _id: { $ne: existingUser._id }
                });
                if (phoneConflict) {
                    return res.status(400).json({
                        success: false,
                        message: "This phone number is already registered with another account",
                    });
                }
            }

            // Update user details
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.password = password;
            if (mobile) existingUser.phoneNumber = mobile;

            // ⏰ Reset expiration time - 2 MINUTES from now
            existingUser.expiresAt = new Date(Date.now() + 2 * 60 * 1000);

            if (referralCode && !existingUser.referredBy) {
                const referrer = await User.findOne({ userId: referralCode });
                if (referrer) {
                    existingUser.referredBy = referrer._id;
                    await User.findByIdAndUpdate(referrer._id, {
                        $inc: { totalReferrals: 1 }
                    });
                }
            }

            // Generate NEW OTP
            const verificationOTP = generateOTP();
            existingUser.emailVerificationOTP = verificationOTP;
            existingUser.emailVerificationOTPExpiry = Date.now() + 10 * 60 * 1000;

            await existingUser.save();

            // Send verification email
            try {
                await sendEmailVerificationOTP(existingUser.email, verificationOTP, existingUser.firstName);
                console.log(`✅ Verification OTP resent to ${existingUser.email}`);
            } catch (emailError) {
                console.error('❌ Verification email failed:', emailError);
            }

            return res.status(200).json({
                success: true,
                message: "Verification code sent! Please check your email.",
                data: {
                    email: existingUser.email,
                    requiresVerification: true,
                    isResend: true
                }
            });
        }

        // ===== NEW USER - CREATE ACCOUNT =====

        // Check phone number uniqueness for new users
        if (mobile) {
            const phoneExists = await User.findOne({ phoneNumber: mobile });
            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: "This phone number is already registered",
                });
            }
        }

        // Generate unique identifiers with retry logic
        const userId = await generateUserId();
        const accountNumber = await generateUniqueAccountNumber();
        console.log(`Generated User ID: ${userId}, Account Number: ${accountNumber}`);

        // Referral handling
        let referrerId = null;
        if (referralCode) {
            const referrer = await User.findOne({ userId: referralCode });
            if (referrer) {
                referrerId = referrer._id;
                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { totalReferrals: 1 },
                });
            }
        }

        // Generate email verification OTP
        const verificationOTP = generateOTP();

        // Create user with 2 MINUTE expiration
        const user = new User({
            userId,
            email: email.toLowerCase(),
            password,
            accountNumber,
            firstName,
            lastName,
            phoneNumber: mobile,
            role: "user",
            accountStatus: "pending",
            isVerified: false,
            emailVerificationOTP: verificationOTP,
            emailVerificationOTPExpiry: Date.now() + 10 * 60 * 1000,
            referralCode: userId,
            referredBy: referrerId,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000) // ⏰ Expire in 2 MINUTES
        });

        await user.save();

        // Send verification email
        try {
            await sendEmailVerificationOTP(user.email, verificationOTP, user.firstName);
            console.log(`✅ Verification OTP sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Verification email failed:', emailError);
        }

        res.status(201).json({
            success: true,
            message: "Verification code sent! Please check your email.",
            data: {
                email: user.email,
                requiresVerification: true
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `This ${field} is already registered`,
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
});

// ============================================
// STEP 2: VERIFY EMAIL OTP
// ============================================
router.post('/verify-email-otp', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Fetch user with plain passwords included
        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select('+emailVerificationOTP +emailVerificationOTPExpiry +password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified. Please login.',
            });
        }

        // Verify OTP
        if (user.emailVerificationOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
            });
        }

        // Check OTP expiry
        if (!user.emailVerificationOTPExpiry || user.emailVerificationOTPExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new one.',
                expired: true
            });
        }

        // ✅ Mark user as verified and remove expiration
        user.isVerified = true;
        user.accountStatus = 'active';
        user.emailVerificationOTP = undefined;
        user.emailVerificationOTPExpiry = undefined;
        user.expiresAt = undefined; // Remove TTL - user is now permanent

        await user.save();

        // Send complete registration email with credentials
        try {
            await sendRegistrationEmail({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                portalPassword: password,
                accountNumber: user.accountNumber,
                currency: user.currency,
                referralCode: user.userId,
            });
            console.log(`✅ Registration email sent to ${user.email} with all credentials`);
        } catch (emailError) {
            console.error('❌ Registration email failed:', emailError);
        }

        // Generate tokens for auto-login
        const { accessToken, refreshToken } = generateTokens(user);

        res.json({
            success: true,
            message: 'Email verified successfully! Welcome to Jaaz Markets.',
            data: {
                accessToken,
                refreshToken,
                user: sanitizeUser(user),
            },
        });

    } catch (error) {
        console.error('Verify email OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed',
        });
    }
});

// ============================================
// RESEND VERIFICATION OTP
// ============================================
router.post('/resend-verification-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        }).select('+emailVerificationOTP +emailVerificationOTPExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified. Please login.',
            });
        }

        // ⏰ Reset expiration time - give user another 2 MINUTES
        user.expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        // Generate new OTP
        const verificationOTP = generateOTP();
        user.emailVerificationOTP = verificationOTP;
        user.emailVerificationOTPExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send new OTP
        try {
            await sendEmailVerificationOTP(user.email, verificationOTP, user.firstName);
            console.log(`✅ Verification OTP resent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Email resend failed:', emailError);
            throw new Error('Failed to send verification email');
        }

        res.json({
            success: true,
            message: 'Verification code resent successfully',
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to resend code',
        });
    }
});

// SIGNIN - Login with Email OR User ID
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/User ID and password are required',
            });
        }

        // Find user by email OR userId
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { userId: email.toUpperCase() }
            ]
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
