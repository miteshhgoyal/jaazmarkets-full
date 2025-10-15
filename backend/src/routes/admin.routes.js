// backend/src/routes/admin.routes.js
import express from 'express';
import User from '../models/User.js';
import TradingAccount from '../models/TradingAccount.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorize(['admin', 'superadmin']));

// GET ALL USERS
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ username: { $ne: 'superadmin' } })
            .select('-password -resetPasswordOTP -resetPasswordOTPExpiry')
            .sort({ createdAt: -1 })
            .lean();

        // Transform data to match frontend expectations
        const transformedUsers = users.map(user => ({
            id: user._id.toString(),
            // Authentication
            username: user.username,
            email: user.email,
            // Personal Info
            firstname: user.firstName,
            lastname: user.lastName,
            mobile: user.phoneNumber || '',
            dateofbirth: user.dateOfBirth,
            // Role
            role: user.role,
            // Address
            addressline1: user.address || '',
            addressline2: '', // Not in model
            city: user.city || '',
            state: user.state || '',
            zipcode: user.postalCode || '',
            country: user.country || '',
            // Status fields
            status: user.accountStatus === 'active' ? 'active' :
                user.accountStatus === 'suspended' ? 'suspended' :
                    user.accountStatus === 'closed' ? 'closed' : 'pending',
            kyc: user.kycStatus,
            // Verification
            emailverified: user.isVerified,
            phoneverified: !!user.phoneNumber && user.isVerified,
            mfaenabled: user.twoFactorEnabled,
            // Wallet
            walletbalance: user.walletBalance,
            currency: user.currency,
            totaldeposits: user.totalDeposits,
            totalwithdrawals: user.totalWithdrawals,
            // Platform Preferences
            preferredMT5Terminal: user.preferredMT5Terminal,
            preferredMT4Terminal: user.preferredMT4Terminal,
            // Referral
            referralCode: user.referralCode,
            referredBy: user.referredBy,
            // Metadata
            createdat: user.createdAt,
            updatedat: user.updatedAt,
            lastlogin: user.lastLogin
        }));

        res.json({
            success: true,
            data: transformedUsers,
            total: transformedUsers.length
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// GET SINGLE USER BY ID
router.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .select('-password -resetPasswordOTP -resetPasswordOTPExpiry')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's trading accounts
        const tradingAccounts = await TradingAccount.find({ userId: user._id })
            .select('accountNumber platform accountType balance currency')
            .lean();

        // Transform data
        const transformedUser = {
            id: user._id.toString(),
            // Authentication
            username: user.username,
            email: user.email,
            // Personal Info
            firstname: user.firstName,
            lastname: user.lastName,
            mobile: user.phoneNumber || '',
            dateofbirth: user.dateOfBirth,
            // Role
            role: user.role,
            // Address
            addressline1: user.address || '',
            addressline2: '',
            city: user.city || '',
            state: user.state || '',
            zipcode: user.postalCode || '',
            country: user.country || '',
            // Status fields
            status: user.accountStatus === 'active' ? 'active' :
                user.accountStatus === 'suspended' ? 'suspended' :
                    user.accountStatus === 'closed' ? 'closed' : 'pending',
            kyc: user.kycStatus,
            // Verification
            emailverified: user.isVerified,
            phoneverified: !!user.phoneNumber && user.isVerified,
            mfaenabled: user.twoFactorEnabled,
            // Wallet
            walletbalance: user.walletBalance,
            currency: user.currency,
            totaldeposits: user.totalDeposits,
            totalwithdrawals: user.totalWithdrawals,
            // Platform Preferences
            preferredMT5Terminal: user.preferredMT5Terminal,
            preferredMT4Terminal: user.preferredMT4Terminal,
            // Referral
            referralCode: user.referralCode,
            referredBy: user.referredBy,
            // Trading Accounts
            tradingaccounts: tradingAccounts.map(acc => ({
                id: acc._id.toString(),
                accountnumber: acc.accountNumber,
                platform: acc.platform,
                type: acc.accountType,
                balance: acc.balance,
                currency: acc.currency
            })),
            // Metadata
            createdat: user.createdAt,
            updatedat: user.updatedAt,
            lastlogin: user.lastLogin
        };

        res.json({
            success: true,
            data: transformedUser
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user details'
        });
    }
});

// UPDATE USER - FULL ADMIN CONTROL
router.put('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Authentication fields
        if (updateData.username !== undefined) user.username = updateData.username || null;
        if (updateData.email !== undefined) user.email = updateData.email;

        // Personal Info
        if (updateData.firstname !== undefined) user.firstName = updateData.firstname;
        if (updateData.lastname !== undefined) user.lastName = updateData.lastname;
        if (updateData.mobile !== undefined) user.phoneNumber = updateData.mobile || null;
        if (updateData.dateofbirth !== undefined) user.dateOfBirth = updateData.dateofbirth;

        // Role
        if (updateData.role !== undefined) user.role = updateData.role;

        // Address
        if (updateData.addressline1 !== undefined) user.address = updateData.addressline1 || null;
        if (updateData.city !== undefined) user.city = updateData.city || null;
        if (updateData.state !== undefined) user.state = updateData.state || null;
        if (updateData.zipcode !== undefined) user.postalCode = updateData.zipcode || null;
        if (updateData.country !== undefined) user.country = updateData.country || null;

        // Status fields
        if (updateData.status) {
            user.accountStatus = updateData.status === 'suspended' ? 'suspended' :
                updateData.status === 'closed' ? 'closed' :
                    updateData.status === 'pending' ? 'pending' : 'active';
        }
        if (updateData.kyc) user.kycStatus = updateData.kyc;

        // Verification fields - ADMIN CAN TOGGLE
        if (updateData.emailverified !== undefined) user.isVerified = updateData.emailverified;
        if (updateData.mfaenabled !== undefined) user.twoFactorEnabled = updateData.mfaenabled;
        if (updateData.phoneverified !== undefined && user.phoneNumber) {
            user.isVerified = updateData.phoneverified;
        }

        // Wallet
        if (updateData.walletbalance !== undefined) user.walletBalance = updateData.walletbalance;
        if (updateData.currency !== undefined) user.currency = updateData.currency;

        // Platform Preferences
        if (updateData.preferredMT5Terminal !== undefined) {
            user.preferredMT5Terminal = updateData.preferredMT5Terminal || null;
        }
        if (updateData.preferredMT4Terminal !== undefined) {
            user.preferredMT4Terminal = updateData.preferredMT4Terminal || null;
        }

        // Referral
        if (updateData.referralCode !== undefined) {
            user.referralCode = updateData.referralCode || null;
        }

        // Save user
        await user.save();

        res.json({
            success: true,
            status: 200,
            message: 'User updated successfully',
            data: {
                id: user._id.toString(),
                username: user.username,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                mobile: user.phoneNumber,
                role: user.role,
                status: user.accountStatus === 'active' ? 'active' :
                    user.accountStatus === 'suspended' ? 'suspended' :
                        user.accountStatus === 'closed' ? 'closed' : 'pending',
                kyc: user.kycStatus,
                emailverified: user.isVerified,
                phoneverified: !!user.phoneNumber && user.isVerified,
                mfaenabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error('Update user error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// DELETE USER
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting admin/superadmin unless you're superadmin
        if ((user.role === 'admin' || user.role === 'superadmin') && req.user.role !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        // Delete user's trading accounts
        await TradingAccount.deleteMany({ userId: user._id });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            status: 200,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// QUICK TOGGLE: UPDATE USER STATUS
router.patch('/users/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        // Map frontend status to backend
        const validStatuses = {
            'active': 'active',
            'suspended': 'suspended',
            'pending': 'pending',
            'closed': 'closed'
        };

        if (!validStatuses[status]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Use: active, suspended, pending, or closed'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { accountStatus: validStatuses[status] },
            { new: true }
        ).select('firstName lastName email accountStatus');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Map back to frontend format
        const frontendStatus = user.accountStatus === 'active' ? 'active' :
            user.accountStatus === 'suspended' ? 'suspended' :
                user.accountStatus === 'closed' ? 'closed' : 'pending';

        res.json({
            success: true,
            message: `User status updated to ${frontendStatus}`,
            data: {
                id: user._id.toString(),
                status: frontendStatus
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
});

// QUICK TOGGLE: UPDATE KYC STATUS
router.patch('/users/:userId/kyc', async (req, res) => {
    try {
        const { userId } = req.params;
        const { kycStatus } = req.body;

        if (!['pending', 'submitted', 'approved', 'rejected'].includes(kycStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid KYC status value. Use: pending, submitted, approved, or rejected'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { kycStatus },
            { new: true }
        ).select('firstName lastName email kycStatus');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `KYC status updated to ${kycStatus}`,
            data: {
                id: user._id.toString(),
                kyc: user.kycStatus
            }
        });
    } catch (error) {
        console.error('Update KYC status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update KYC status'
        });
    }
});

// QUICK TOGGLE: UPDATE VERIFICATION
router.patch('/users/:userId/verification', async (req, res) => {
    try {
        const { userId } = req.params;
        const { field, value } = req.body;

        if (!['emailverified', 'phoneverified', 'mfaenabled'].includes(field)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification field. Use: emailverified, phoneverified, or mfaenabled'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update the appropriate field
        if (field === 'emailverified' || field === 'phoneverified') {
            user.isVerified = value;
        } else if (field === 'mfaenabled') {
            user.twoFactorEnabled = value;
        }

        await user.save();

        res.json({
            success: true,
            message: `${field.replace(/([A-Z])/g, ' $1').trim()} updated successfully`,
            data: {
                id: user._id.toString(),
                [field]: value
            }
        });
    } catch (error) {
        console.error('Update verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update verification status'
        });
    }
});

// GET USER STATISTICS
router.get('/stats/users/overview', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ accountStatus: 'active' });
        const suspendedUsers = await User.countDocuments({ accountStatus: 'suspended' });
        const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });
        const approvedKYC = await User.countDocuments({ kycStatus: 'approved' });

        // New users this month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.json({
            success: true,
            data: {
                totalusers: totalUsers,
                activeusers: activeUsers,
                suspendedusers: suspendedUsers,
                pendingkyc: pendingKYC,
                approvedkyc: approvedKYC,
                newthismonth: newUsersThisMonth
            }
        });
    } catch (error) {
        console.error('Get user statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
});

export default router;
