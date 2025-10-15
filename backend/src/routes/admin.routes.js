// backend/src/routes/admin.routes.js
import express from 'express';
import User from '../models/User.js';
import TradingAccount from '../models/TradingAccount.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorize(['admin', 'superadmin']));

// ============================================
// GET ALL USERS
// ============================================
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -resetPasswordOTP -resetPasswordOTPExpiry')
            .sort({ createdAt: -1 })
            .lean();

        // Transform data to match frontend expectations
        const transformedUsers = users.map(user => ({
            id: user._id.toString(),
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            mobile: user.phoneNumber || '',
            date_of_birth: user.dateOfBirth,

            // Address
            address_line1: user.address || '',
            address_line2: '',
            city: user.city || '',
            state: user.state || '',
            zip_code: user.postalCode || '',
            country: user.country || '',
            country_code: '',

            // Status fields
            status: user.accountStatus === 'active' ? 'active' :
                user.accountStatus === 'suspended' ? 'suspended' : 'inactive',
            kyc: user.kycStatus,
            level: 'beginner', // You can add this field to User model if needed

            // Verification
            email_verified: user.isVerified,
            phone_verified: !!user.phoneNumber,
            mfa_enabled: user.twoFactorEnabled,

            // Metadata
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            last_login: user.lastLogin
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

// ============================================
// GET SINGLE USER BY ID
// ============================================
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

        // Transform data to match frontend expectations
        const transformedUser = {
            id: user._id.toString(),
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            mobile: user.phoneNumber || '',
            date_of_birth: user.dateOfBirth,

            // Address
            address_line1: user.address || '',
            address_line2: '',
            city: user.city || '',
            state: user.state || '',
            zip_code: user.postalCode || '',
            country: user.country || '',
            country_code: '',

            // Status fields
            status: user.accountStatus === 'active' ? 'active' :
                user.accountStatus === 'suspended' ? 'suspended' : 'inactive',
            kyc: user.kycStatus,
            level: 'beginner',

            // Verification
            email_verified: user.isVerified,
            phone_verified: !!user.phoneNumber,
            mfa_enabled: user.twoFactorEnabled,

            // Wallet
            wallet_balance: user.walletBalance,
            currency: user.currency,
            total_deposits: user.totalDeposits,
            total_withdrawals: user.totalWithdrawals,

            // Trading Accounts
            trading_accounts: tradingAccounts.map(acc => ({
                id: acc._id.toString(),
                account_number: acc.accountNumber,
                platform: acc.platform,
                type: acc.accountType,
                balance: acc.balance,
                currency: acc.currency
            })),

            // Metadata
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            last_login: user.lastLogin,
            role: user.role
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

// ============================================
// UPDATE USER
// ============================================
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

        // Map frontend fields to backend User model fields
        if (updateData.first_name) user.firstName = updateData.first_name;
        if (updateData.last_name) user.lastName = updateData.last_name;
        if (updateData.email) user.email = updateData.email;
        if (updateData.mobile !== undefined) user.phoneNumber = updateData.mobile || null;
        if (updateData.date_of_birth) user.dateOfBirth = updateData.date_of_birth;

        // Address
        if (updateData.address_line1 !== undefined) user.address = updateData.address_line1 || null;
        if (updateData.city !== undefined) user.city = updateData.city || null;
        if (updateData.state !== undefined) user.state = updateData.state || null;
        if (updateData.zip_code !== undefined) user.postalCode = updateData.zip_code || null;
        if (updateData.country !== undefined) user.country = updateData.country || null;

        // Status fields
        if (updateData.status) {
            user.accountStatus = updateData.status === 'active' ? 'active' :
                updateData.status === 'suspended' ? 'suspended' : 'pending';
        }
        if (updateData.kyc) {
            user.kycStatus = updateData.kyc;
        }

        // Save user
        await user.save();

        res.json({
            success: true,
            status: 200,
            message: 'User updated successfully',
            data: {
                id: user._id.toString(),
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                mobile: user.phoneNumber,
                status: user.accountStatus,
                kyc: user.kycStatus
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

// ============================================
// DELETE USER
// ============================================
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

// ============================================
// UPDATE USER STATUS (Quick action)
// ============================================
router.patch('/users/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended', 'pending', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { accountStatus: status },
            { new: true }
        ).select('firstName lastName email accountStatus');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: {
                id: user._id.toString(),
                status: user.accountStatus
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

// ============================================
// UPDATE KYC STATUS (Quick action)
// ============================================
router.patch('/users/:userId/kyc', async (req, res) => {
    try {
        const { userId } = req.params;
        const { kycStatus } = req.body;

        if (!['pending', 'submitted', 'approved', 'rejected'].includes(kycStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid KYC status value'
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
            message: 'KYC status updated successfully',
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

// ============================================
// GET USER STATISTICS
// ============================================
router.get('/users/stats/overview', async (req, res) => {
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
                total_users: totalUsers,
                active_users: activeUsers,
                suspended_users: suspendedUsers,
                pending_kyc: pendingKYC,
                approved_kyc: approvedKYC,
                new_this_month: newUsersThisMonth
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
