import express from 'express';
import TradingAccount from '../models/TradingAccount.js';
import User from '../models/User.js';
import Settings from '../models/Setting.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import {
    sendTradingAccountCreatedEmail,
    generateTraderPassword,
    generateInvestorPassword
} from '../services/emailService.js';

const router = express.Router();

// Generate unique account number
const generateAccountNumber = async () => {
    const prefix = 'JM';
    let accountNumber;
    let exists = true;

    while (exists) {
        const randomNum = Math.floor(100000000 + Math.random() * 900000000);
        accountNumber = `${prefix}${randomNum}`;
        const existingAccount = await TradingAccount.findOne({ accountNumber });
        if (!existingAccount) exists = false;
    }
    return accountNumber;
};

const generateLogin = () => Math.floor(10000000 + Math.random() * 90000000).toString();

const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

const getServerUrl = (platform) => {
    const servers = {
        'MT4': 'mt4.jaazmarkets.com',
        'MT5': 'mt5.jaazmarkets.com',
        'cTrader': 'ctrader.jaazmarkets.com'
    };
    return servers[platform] || 'demo.jaazmarkets.com';
};

// GET SETTINGS
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings || !settings.accountTypes || settings.accountTypes.length <= 0) {
            settings = new Settings({
                accountTypes: [
                    {
                        id: 'standard',
                        name: 'Standard',
                        category: 'Standard accounts',
                        description: 'Perfect for beginners',
                        image: 'https://img.icons8.com/3d-fluency/94/trophy.png',
                        minDeposit: '$1',
                        minSpread: '1.5 pips',
                        maxLeverage: '1:1000',
                        commission: 'No commission',
                        features: ['Low minimum deposit', 'Flexible leverage', 'No commission'],
                        isActive: true
                    },
                    {
                        id: 'standard-cent',
                        name: 'Standard Cent',
                        category: 'Standard accounts',
                        description: 'Trade in cents',
                        image: 'https://img.icons8.com/3d-fluency/94/medal.png',
                        minDeposit: '$1',
                        minSpread: '1.5 pips',
                        maxLeverage: '1:1000',
                        commission: 'No commission',
                        features: ['Trade in cents', 'Perfect for testing', 'Low risk'],
                        isActive: true
                    },
                    {
                        id: 'pro',
                        name: 'Pro',
                        category: 'Professional accounts',
                        description: 'For experienced traders',
                        image: 'https://img.icons8.com/3d-fluency/94/star.png',
                        minDeposit: '$500',
                        minSpread: '0.8 pips',
                        maxLeverage: '1:500',
                        commission: 'Low commission',
                        features: ['Lower spreads', 'Priority support', 'Advanced tools'],
                        isActive: true
                    },
                    {
                        id: 'raw-spread',
                        name: 'Raw Spread',
                        category: 'Professional accounts',
                        description: 'Institutional level spreads',
                        image: 'https://img.icons8.com/3d-fluency/94/crown.png',
                        minDeposit: '$1000',
                        minSpread: '0.0 pips',
                        maxLeverage: '1:500',
                        commission: '$3.5 per lot',
                        features: ['Raw spreads', 'Institutional pricing', 'Fast execution'],
                        isActive: true
                    },
                    {
                        id: 'zero',
                        name: 'Zero',
                        category: 'Professional accounts',
                        description: 'Zero spread account',
                        image: 'https://img.icons8.com/3d-fluency/94/crown.png',
                        minDeposit: '$2000',
                        minSpread: '0.0 pips',
                        maxLeverage: '1:500',
                        commission: '$5 per lot',
                        features: ['Zero spreads', 'Best pricing', 'Premium support'],
                        isActive: true
                    }
                ],
                currencies: [
                    { code: 'USD', name: 'US Dollar', symbol: '$', isActive: true },
                    { code: 'EUR', name: 'Euro', symbol: '€', isActive: true },
                    { code: 'GBP', name: 'British Pound', symbol: '£', isActive: true },
                    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', isActive: true },
                    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isActive: true }
                ],
                leverageOptions: ['1:50', '1:100', '1:200', '1:500', '1:1000', '1:2000', '1:Unlimited'],
                platforms: [
                    { name: 'MT4', isActive: true, serverUrl: 'mt4.jaazmarkets.com' },
                    { name: 'MT5', isActive: true, serverUrl: 'mt5.jaazmarkets.com' },
                    { name: 'cTrader', isActive: true, serverUrl: 'ctrader.jaazmarkets.com' }
                ]
            });
            await settings.save();
        }

        res.json({
            success: true,
            data: {
                accountTypes: settings.accountTypes.filter(t => t.isActive),
                currencies: settings.currencies.filter(c => c.isActive),
                leverageOptions: settings.leverageOptions,
                platforms: settings.platforms.filter(p => p.isActive)
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
});

// CREATE ACCOUNT
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { accountType, platform, accountClass, currency, leverage, startingBalance, nickname } = req.body;

        if (!accountType || !platform || !accountClass || !currency || !leverage) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const settings = await Settings.findOne();
        const accountTypeConfig = settings?.accountTypes.find(t => t.name === accountClass && t.isActive);

        if (!accountTypeConfig) {
            return res.status(400).json({
                success: false,
                message: 'Invalid account type'
            });
        }

        // Get user details for email
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const accountNumber = await generateAccountNumber();
        const login = generateLogin();
        const password = generatePassword();
        const server = getServerUrl(platform);

        // ===== GENERATE TRADER & INVESTOR PASSWORDS =====
        const plainTraderPassword = generateTraderPassword();
        const plainInvestorPassword = generateInvestorPassword();

        const balance = accountType === 'Demo' ? (startingBalance || 10000) : 0;

        const tradingAccount = new TradingAccount({
            userId: req.user.userId,
            accountNumber,
            login,
            password,
            traderPassword: plainTraderPassword,      // Will be hashed by pre-save hook
            investorPassword: plainInvestorPassword,  // Will be hashed by pre-save hook
            plainTraderPassword: plainTraderPassword,   // Temporary - for email
            plainInvestorPassword: plainInvestorPassword, // Temporary - for email
            accountType,
            platform,
            accountClass,
            currency,
            leverage,
            server,
            balance,
            equity: balance,
            freeMargin: balance,
            nickname: nickname || accountClass,
            status: 'active'
        });

        await tradingAccount.save();

        // Add to user's trading accounts
        await User.findByIdAndUpdate(
            req.user.userId,
            { $push: { tradingAccounts: tradingAccount._id } }
        );

        // ===== SEND EMAIL WITH ALL CREDENTIALS =====
        try {
            await sendTradingAccountCreatedEmail({
                email: user.email,
                userName: `${user.firstName} ${user.lastName}`,
                accountNumber: tradingAccount.accountNumber,
                login: tradingAccount.login,
                platform: tradingAccount.platform,
                server: tradingAccount.server,
                accountType: tradingAccount.accountType,
                accountClass: tradingAccount.accountClass,
                currency: tradingAccount.currency,
                leverage: tradingAccount.leverage,
                balance: tradingAccount.balance,
                traderPassword: plainTraderPassword,    // Plain text for email
                investorPassword: plainInvestorPassword // Plain text for email
            });
            console.log(`✅ Trading account email sent to ${user.email}`);

            // ===== DELETE PLAIN PASSWORDS AFTER EMAIL SENT =====
            tradingAccount.plainTraderPassword = undefined;
            tradingAccount.plainInvestorPassword = undefined;
            await tradingAccount.save();

        } catch (emailError) {
            console.error('❌ Trading account email failed:', emailError);
            // Don't fail the request - account is still created
        }

        res.status(201).json({
            success: true,
            message: 'Trading account created successfully',
            data: {
                accountNumber: tradingAccount.accountNumber,
                login: tradingAccount.login,
                password: password,  // Main password (for MT terminal login)
                traderPassword: plainTraderPassword,
                investorPassword: plainInvestorPassword,
                platform: tradingAccount.platform,
                server: tradingAccount.server,
                accountType: tradingAccount.accountType,
                accountClass: tradingAccount.accountClass,
                currency: tradingAccount.currency,
                leverage: tradingAccount.leverage,
                balance: tradingAccount.balance,
                nickname: tradingAccount.nickname
            }
        });
    } catch (error) {
        console.error('Create account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
});

// GET USER'S ACCOUNTS
router.get('/my-accounts', authenticateToken, async (req, res) => {
    try {
        const accounts = await TradingAccount.find({
            userId: req.user.userId
        }).select('-password');

        res.json({
            success: true,
            data: accounts
        });
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts'
        });
    }
});

// GET SINGLE ACCOUNT
router.get('/my-accounts/:accountId', authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await TradingAccount.findOne({
            _id: accountId,
            userId: req.user.userId
        }).select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account'
        });
    }
});

// ADMIN: MANAGE SETTINGS
router.put('/settings', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const updateData = req.body;
        updateData.updatedBy = req.user.userId;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(updateData);
        } else {
            Object.assign(settings, updateData);
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
});

// ADMIN: GET ALL ACCOUNTS (Enhanced)
router.get('/admin/all', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { page = 1, limit = 1000, accountType, platform, status, search } = req.query;

        const query = {};

        if (accountType) query.accountType = accountType;
        if (platform) query.platform = platform;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { accountNumber: { $regex: search, $options: 'i' } },
                { login: { $regex: search, $options: 'i' } }
            ];
        }

        const accounts = await TradingAccount.find(query)
            .populate('userId', 'firstName lastName email phoneNumber')
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await TradingAccount.countDocuments(query);

        res.json({
            success: true,
            data: accounts,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get all accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts'
        });
    }
});

// ADMIN: GET SINGLE ACCOUNT BY ID
router.get('/admin/:accountId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await TradingAccount.findById(accountId)
            .populate('userId', 'firstName lastName email phoneNumber')
            .select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account'
        });
    }
});

// ADMIN: UPDATE ACCOUNT (FULL UPDATE)
router.put('/admin/:accountId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { accountId } = req.params;
        const updateData = req.body;

        // Don't allow updating account number, login, or password through this route
        delete updateData.accountNumber;
        delete updateData.login;
        delete updateData.password;

        const account = await TradingAccount.findByIdAndUpdate(
            accountId,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('userId', 'firstName lastName email')
            .select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            message: 'Account updated successfully',
            data: account
        });
    } catch (error) {
        console.error('Update account error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update account'
        });
    }
});

// ADMIN: DELETE ACCOUNT
router.delete('/admin/:accountId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await TradingAccount.findById(accountId);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        // Remove account reference from user
        await User.findByIdAndUpdate(
            account.userId,
            { $pull: { tradingAccounts: accountId } }
        );

        // Delete the account
        await TradingAccount.findByIdAndDelete(accountId);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
});

// ADMIN: UPDATE ACCOUNT STATUS
router.patch('/admin/:accountId/status', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { accountId } = req.params;
        const { status } = req.body;

        const validStatuses = ['active', 'suspended', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const account = await TradingAccount.findByIdAndUpdate(
            accountId,
            { status },
            { new: true }
        ).select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            message: 'Account status updated',
            data: account
        });
    } catch (error) {
        console.error('Update account status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update account status'
        });
    }
});

// ADMIN: UPDATE ACCOUNT BALANCE
router.patch('/admin/:accountId/balance', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { accountId } = req.params;
        const { balance, equity, freeMargin } = req.body;

        const updateData = {};
        if (balance !== undefined) updateData.balance = balance;
        if (equity !== undefined) updateData.equity = equity;
        if (freeMargin !== undefined) updateData.freeMargin = freeMargin;

        const account = await TradingAccount.findByIdAndUpdate(
            accountId,
            updateData,
            { new: true }
        ).select('-password');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            message: 'Account balance updated',
            data: account
        });
    } catch (error) {
        console.error('Update account balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update account balance'
        });
    }
});

export default router;
