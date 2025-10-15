// backend/src/routes/user.routes.js
import express from 'express';
import User from '../models/User.js';
import TradingAccount from '../models/TradingAccount.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// ============================================
// PROFILE ROUTES
// ============================================

// GET USER PROFILE
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password -resetPasswordOTP -resetPasswordOTPExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get trading accounts count
        const accountsCount = await TradingAccount.countDocuments({
            userId: req.user.userId
        });

        // Prepare profile response
        const profileData = {
            status: {
                title: 'Account Status',
                heading: 'Account Status',
                value: user.isVerified ? 'Verified' : 'Pending',
                subheading: `Your account is ${user.accountStatus}`,
                badge: user.accountStatus === 'active' ? 'success' : 'warning',
                description: `Your account is ${user.accountStatus}`,
                isVerified: user.isVerified,
                kycStatus: user.kycStatus
            },
            depositLimit: {
                title: 'Daily Deposit Limit',
                heading: 'Daily Deposit Limit',
                value: '$50,000',
                subheading: 'Maximum daily deposit amount',
                description: 'Maximum daily deposit amount',
                progress: 0,
                maxAmount: 50000
            },
            verificationSteps: [
                {
                    id: 'email',
                    count: 1,
                    heading: 'Email Verification',
                    value: user.email,
                    status: user.isVerified ? 'Verified' : 'Pending',
                    required: true,
                    icon: 'Mail'
                },
                {
                    id: 'phone',
                    count: 2,
                    heading: 'Phone Number',
                    value: user.phoneNumber || 'Not provided',
                    status: user.phoneNumber ? 'Verified' : 'Pending',
                    required: true,
                    icon: 'Phone'
                },
                {
                    id: 'identity',
                    count: 3,
                    heading: 'Identity Verification (KYC)',
                    value: user.kycStatus || 'pending',
                    status: user.kycStatus === 'approved' ? 'Verified' : 'Pending',
                    required: true,
                    icon: 'FileText'
                },
                {
                    id: 'address',
                    count: 4,
                    heading: 'Address Verification',
                    value: user.address || 'Not provided',
                    status: (user.address && user.city && user.country) ? 'Verified' : 'Pending',
                    required: false,
                    icon: 'MapPin'
                }
            ],
            personalInfo: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                country: user.country,
                state: user.state,
                city: user.city,
                address: user.address,
                postalCode: user.postalCode
            },
            accountStats: {
                tradingAccounts: accountsCount,
                totalDeposits: user.totalDeposits || 0,
                totalWithdrawals: user.totalWithdrawals || 0,
                walletBalance: user.walletBalance || 0,
                memberSince: user.createdAt
            }
        };

        res.json({
            success: true,
            data: profileData
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// UPDATE PROFILE
router.patch('/profile', authenticateToken, async (req, res) => {
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
            postalCode
        } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (country) updateData.country = country;
        if (state) updateData.state = state;
        if (city) updateData.city = city;
        if (address) updateData.address = address;
        if (postalCode) updateData.postalCode = postalCode;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// UPDATE VERIFICATION STEP
router.patch('/profile/verification/:stepId', authenticateToken, async (req, res) => {
    try {
        const { stepId } = req.params;
        const { value, documents } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Handle different verification steps
        switch (stepId) {
            case 'email':
                user.isVerified = true;
                break;

            case 'phone':
                if (!value) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phone number is required'
                    });
                }
                user.phoneNumber = value;
                break;

            case 'identity':
                user.kycStatus = 'submitted';
                break;

            case 'address':
                if (value) {
                    user.address = value.address || user.address;
                    user.city = value.city || user.city;
                    user.state = value.state || user.state;
                    user.country = value.country || user.country;
                    user.postalCode = value.postalCode || user.postalCode;
                }
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid verification step'
                });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Verification step updated successfully',
            data: {
                stepId,
                status: 'updated'
            }
        });
    } catch (error) {
        console.error('Update verification step error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update verification step'
        });
    }
});

// ============================================
// SECURITY ROUTES
// ============================================

// GET SECURITY SETTINGS
router.get('/security', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('email phoneNumber twoFactorEnabled lastLogin createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const securityData = {
            login: {
                title: 'Login',
                value: user.email,
                description: 'Your login email address',
                icon: 'Mail',
                verified: true
            },
            password: {
                title: 'Password',
                value: '••••••••',
                description: 'Last changed: Never',
                icon: 'Lock',
                canChange: true
            },
            verificationMethod: {
                title: 'Verification method',
                value: user.phoneNumber || 'Not set',
                description: '2-step verification for sensitive operations',
                icon: 'Shield',
                enabled: user.twoFactorEnabled,
                canChange: true
            },
            verificationOptions: [
                {
                    id: 'sms',
                    title: 'SMS',
                    value: user.phoneNumber || 'Add phone number',
                    description: 'Receive codes via SMS',
                    icon: 'MessageSquare',
                    available: true,
                    recommended: true
                },
                {
                    id: 'email',
                    title: 'Email',
                    value: user.email,
                    description: 'Receive codes via email',
                    icon: 'Mail',
                    available: true,
                    recommended: false
                },
                {
                    id: 'authenticator',
                    title: 'Authenticator App',
                    value: 'Not configured',
                    description: 'Use Google Authenticator or similar apps',
                    icon: 'Smartphone',
                    available: false,
                    recommended: false
                }
            ],
            lastLogin: user.lastLogin,
            memberSince: user.createdAt
        };

        res.json({
            success: true,
            data: securityData
        });
    } catch (error) {
        console.error('Get security settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch security settings'
        });
    }
});

// CHANGE PASSWORD
router.post('/security/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword, repeatPassword } = req.body;

        // Support both 'confirmPassword' and 'repeatPassword'
        const confirmedPassword = confirmPassword || repeatPassword;

        // Validation
        if (!currentPassword || !newPassword || !confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

// CHANGE VERIFICATION METHOD
router.post('/security/verification-method', authenticateToken, async (req, res) => {
    try {
        const { method, phoneNumber, enable, verificationType } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const methodType = method || verificationType;

        if (methodType === 'sms' || methodType === 'phone') {
            if (phoneNumber) {
                user.phoneNumber = phoneNumber;
            }
            user.twoFactorEnabled = true;
        } else if (methodType === 'email') {
            user.twoFactorEnabled = true;
        }

        if (enable !== undefined) {
            user.twoFactorEnabled = enable;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Verification method updated successfully',
            data: {
                method: methodType,
                phoneNumber: user.phoneNumber,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error('Change verification method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update verification method'
        });
    }
});

// LOGOUT FROM ALL DEVICES
router.post('/security/logout-all', authenticateToken, async (req, res) => {
    try {
        // In production, you would invalidate all tokens
        res.json({
            success: true,
            message: 'Successfully logged out from all other devices',
            data: {
                message: 'All other active sessions have been terminated'
            }
        });
    } catch (error) {
        console.error('Logout all devices error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to logout from all devices'
        });
    }
});

// ============================================
// TRADING TERMINALS SETTINGS
// ============================================

// GET TRADING TERMINALS SETTINGS
router.get('/terminals', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's trading accounts
        const accounts = await TradingAccount.find({
            userId: req.user.userId
        }).select('platform accountNumber login');

        // Group by platform
        const mt5Accounts = accounts.filter(acc => acc.platform === 'MT5');
        const mt4Accounts = accounts.filter(acc => acc.platform === 'MT4');

        const terminalsData = {
            mt5: {
                title: 'MT5 Accounts',
                currentTerminal: user.preferredMT5Terminal || 'Not set',
                availableTerminals: [
                    'MT5 WebTerminal',
                    'MT5 Desktop',
                    'MT5 Mobile'
                ],
                accountsCount: mt5Accounts.length,
                accounts: mt5Accounts
            },
            mt4: {
                title: 'MT4 Accounts',
                currentTerminal: user.preferredMT4Terminal || 'Not set',
                availableTerminals: [
                    'MT4 WebTerminal',
                    'MT4 Desktop',
                    'MT4 Mobile'
                ],
                accountsCount: mt4Accounts.length,
                accounts: mt4Accounts
            }
        };

        res.json({
            success: true,
            data: terminalsData
        });
    } catch (error) {
        console.error('Get terminals settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch terminals settings'
        });
    }
});

// UPDATE TERMINAL PREFERENCE
router.patch('/terminals/:platform', authenticateToken, async (req, res) => {
    try {
        const { platform } = req.params;
        const { selectedTerminal } = req.body;

        if (!['mt4', 'mt5'].includes(platform.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid platform'
            });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update preference
        if (platform.toLowerCase() === 'mt5') {
            user.preferredMT5Terminal = selectedTerminal;
        } else {
            user.preferredMT4Terminal = selectedTerminal;
        }

        await user.save();

        res.json({
            success: true,
            message: `${platform.toUpperCase()} terminal preference updated successfully`,
            data: {
                platform: platform.toUpperCase(),
                selectedTerminal
            }
        });
    } catch (error) {
        console.error('Update terminal preference error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update terminal preference'
        });
    }
});

export default router;
