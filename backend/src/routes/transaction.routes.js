import express from 'express';
import https from 'https';
import crypto from 'crypto';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import TradingAccount from '../models/TradingAccount.js';
import Transfer from '../models/Transfer.js';
import User from '../models/User.js';
import Settings from '../models/Setting.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import WebhookLog from '../models/WebhookLog.js';

const router = express.Router();

const getBlockBeeSettings = async () => {
    const settings = await Settings.findOne();

    if (!settings || !settings.blockBeeSettings) {
        return null;
    }

    const blockBee = settings.blockBeeSettings;

    if (!blockBee.apiKeyV2 || blockBee.apiKeyV2.trim() === '') {
        throw new Error('BlockBee API key is not configured');
    }

    return blockBee;
};

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        }).on('error', (error) => reject(error));
    });
}

/**
 * Generate unique UUID for BlockBee transaction
 */
function generateBlockBeeUUID() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Initiate BlockBee payment address (PHP equivalent)
 * @param {Object} payment - Mongoose deposit document
 * @param {string} uuid - Unique identifier for this transaction
 * @param {string} ticker - Coin ticker (default: "bep20/usdt")
 * @returns {Promise<Object>} BlockBee API response with status
 */
async function initiate_blockbee(payment, uuid, ticker = "bep20/usdt") {
    try {
        // Get API key from settings
        const blockBeeSettings = await getBlockBeeSettings();
        const apiKey = blockBeeSettings.apiKeyV2;

        // Build callback URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const callbackUrl = `${baseUrl}/api/transactions/blockbee/callback/${uuid}`;

        // Build query parameters (same as PHP code)
        const queryParams = {
            apikey: apiKey,
            callback: callbackUrl,
            pending: "0",
            confirmations: "1",
            post: "1",
            json: "1",
            priority: "default",
            multi_token: "0",
            convert: "1"
        };

        // Build query string
        const queryString = new URLSearchParams(queryParams).toString();

        // Build API URL
        const apiUrl = `https://api.blockbee.io/${ticker}/create/?${queryString}`;

        console.log('BlockBee API Request:', apiUrl);

        // Make GET request
        const response = await httpsGet(apiUrl);

        console.log('BlockBee API Response:', JSON.stringify(response, null, 2));

        // Check if successful (same as PHP code)
        if (response.status === 'success') {
            // Determine coin name based on ticker
            const coinName = ticker === 'bep20/usdt' ? 'BEP20 (USDT)' :
                ticker === 'trc20/usdt' ? 'TRC20 (USDT)' :
                    ticker.toUpperCase();

            // Update payment document (same as PHP code)
            payment.blockbee_coin = coinName;
            payment.api_response = JSON.stringify(response);
            payment.data = response;
            payment.blockbee_address = response.address_in;

            // Additional fields for better tracking
            payment.blockBee = {
                coin: coinName,
                ticker: ticker,
                address: response.address_in,
                qrCode: response.qr_code || null,
                qrCodeUrl: response.qr_code_url || null,
                paymentUrl: response.payment_url || null,
                callbackUrl: callbackUrl,
                apiResponse: response,
                blockBeeStatus: 'pending_payment',
                uuid: uuid,
                createdAt: new Date()
            };

            await payment.save();

            return {
                status: true,
                data: response
            };
        } else {
            console.error('BlockBee API Error:', response);
            return {
                status: false,
                error: response.error || 'Failed to create payment address'
            };
        }

    } catch (error) {
        console.error('BlockBee initiation error:', error.message);
        return {
            status: false,
            error: error.message || 'Failed to initiate BlockBee payment'
        };
    }
}

// ============================================
// GET DEPOSIT METHODS (from Settings)
// ============================================
router.get('/deposit-methods', authenticateToken, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Seed deposit methods if not existing
        if (!settings || !settings.depositMethods || settings.depositMethods.length === 0) {
            settings = await Settings.findOne() || new Settings();

            settings.depositMethods = [
                {
                    id: 'usdt-erc20',
                    name: 'USDT (ERC20)',
                    type: 'crypto',
                    currencyType: 'USDT',
                    network: 'ERC20',
                    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                    minDeposit: 10,
                    maxDeposit: 50000,
                    fee: 0,
                    feePercentage: 0,
                    processingTime: '10-30 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png',
                    description: 'Ethereum network - ERC20',
                    isActive: true,
                    recommended: true
                },
                {
                    id: 'usdt-trc20',
                    name: 'USDT (TRC20)',
                    type: 'crypto',
                    currencyType: 'USDT',
                    network: 'TRC20',
                    walletAddress: 'TYASr5UV6HEcXatwdFQfqLvhqZJZ9Xwgaq',
                    minDeposit: 10,
                    maxDeposit: 50000,
                    fee: 0,
                    feePercentage: 0,
                    processingTime: '5-15 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png',
                    description: 'Tron network - TRC20',
                    isActive: true,
                    recommended: true
                },
                {
                    id: 'btc',
                    name: 'Bitcoin (BTC)',
                    type: 'crypto',
                    currencyType: 'BTC',
                    network: 'BTC',
                    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                    minDeposit: 0.001,
                    maxDeposit: 10,
                    fee: 0,
                    feePercentage: 0,
                    processingTime: '30-60 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png',
                    description: 'Bitcoin network',
                    isActive: true,
                    recommended: false
                },
                {
                    id: 'eth',
                    name: 'Ethereum (ETH)',
                    type: 'crypto',
                    currencyType: 'ETH',
                    network: 'ERC20',
                    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                    minDeposit: 0.01,
                    maxDeposit: 100,
                    fee: 0,
                    feePercentage: 0,
                    processingTime: '10-30 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png',
                    description: 'Ethereum network',
                    isActive: true,
                    recommended: false
                }
            ];


            await settings.save();
        }

        const activeMethods = settings.depositMethods.filter(m => m.isActive);

        res.json({
            success: true,
            data: activeMethods
        });
    } catch (error) {
        console.error('Get deposit methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposit methods'
        });
    }
});

// ============================================
// GET WITHDRAWAL METHODS (from Settings)
// ============================================
router.get('/withdrawal-methods', authenticateToken, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings || !settings.withdrawalMethods || settings.withdrawalMethods.length === 0) {
            settings = await Settings.findOne() || new Settings();

            settings.withdrawalMethods = [
                {
                    id: 'usdt-erc20',
                    name: 'USDT (ERC20)',
                    type: 'crypto',
                    currencyType: 'USDT',
                    network: 'ERC20',
                    minWithdrawal: 20,
                    maxWithdrawal: 50000,
                    fee: 2,
                    feePercentage: 0,
                    processingTime: '10-30 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png',
                    description: 'Ethereum network - ERC20',
                    limits: 'Min: 20 USDT, Max: 50,000 USDT',
                    isActive: true,
                    recommended: true
                },
                {
                    id: 'usdt-trc20',
                    name: 'USDT (TRC20)',
                    type: 'crypto',
                    currencyType: 'USDT',
                    network: 'TRC20',
                    minWithdrawal: 20,
                    maxWithdrawal: 50000,
                    fee: 1,
                    feePercentage: 0,
                    processingTime: '5-15 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png',
                    description: 'Tron network - TRC20',
                    limits: 'Min: 20 USDT, Max: 50,000 USDT',
                    isActive: true,
                    recommended: true
                },
                {
                    id: 'btc',
                    name: 'Bitcoin (BTC)',
                    type: 'crypto',
                    currencyType: 'BTC',
                    network: 'BTC',
                    minWithdrawal: 0.002,
                    maxWithdrawal: 10,
                    fee: 0.0005,
                    feePercentage: 0,
                    processingTime: '30-60 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png',
                    description: 'Bitcoin network',
                    limits: 'Min: 0.002 BTC, Max: 10 BTC',
                    isActive: true,
                    recommended: false
                },
                {
                    id: 'eth',
                    name: 'Ethereum (ETH)',
                    type: 'crypto',
                    currencyType: 'ETH',
                    network: 'ERC20',
                    minWithdrawal: 0.02,
                    maxWithdrawal: 100,
                    fee: 0.005,
                    feePercentage: 0,
                    processingTime: '10-30 minutes',
                    image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png',
                    description: 'Ethereum network',
                    limits: 'Min: 0.02 ETH, Max: 100 ETH',
                    isActive: true,
                    recommended: false
                },
                {
                    id: 'bank-transfer',
                    name: 'Bank Transfer (INR)',
                    type: 'bank',
                    currencyType: 'INR',
                    minWithdrawal: 1000,
                    maxWithdrawal: 500000,
                    fee: 0,
                    feePercentage: 0,
                    processingTime: '1-3 business days',
                    image: 'https://img.icons8.com/3d-fluency/94/bank-building.png',
                    description: 'Direct bank transfer to your account',
                    limits: 'Min: ₹1,000, Max: ₹5,00,000',
                    isActive: true,
                    recommended: false
                }
            ];


            await settings.save();
        }

        const activeMethods = settings.withdrawalMethods.filter(m => m.isActive);

        res.json({
            success: true,
            data: activeMethods
        });
    } catch (error) {
        console.error('Get withdrawal methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch withdrawal methods'
        });
    }
});

// ============================================
// CREATE DEPOSIT
// ============================================
router.post('/deposits', authenticateToken, async (req, res) => {
    try {
        const {
            tradingAccountId,
            amount,
            currency,
            paymentMethod,
            paymentDetails,
            proofOfPayment,
            userNotes
        } = req.body;

        // Validation
        if (!amount || !currency || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Amount, currency, and payment method are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        // Validate trading account if provided
        if (tradingAccountId) {
            const account = await TradingAccount.findOne({
                _id: tradingAccountId,
                userId: req.user.userId
            });

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Trading account not found'
                });
            }
        }

        // Generate transaction ID
        const transactionId = `DEP${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create deposit
        const deposit = new Deposit({
            userId: req.user.userId,
            tradingAccountId,
            transactionId,
            amount,
            currency,
            paymentMethod,
            paymentDetails,
            proofOfPayment,
            userNotes,
            status: 'pending'
        });

        await deposit.save();

        res.status(201).json({
            success: true,
            message: 'Deposit request created successfully',
            data: {
                transactionId: deposit.transactionId,
                amount: deposit.amount,
                currency: deposit.currency,
                status: deposit.status,
                createdAt: deposit.createdAt
            }
        });
    } catch (error) {
        console.error('Create deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create deposit request'
        });
    }
});

// ============================================
// GET USER'S DEPOSITS
// ============================================
router.get('/deposits', authenticateToken, async (req, res) => {
    try {
        const {
            status,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        const query = { userId: req.user.userId };

        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const deposits = await Deposit.find(query)
            .populate('tradingAccountId', 'accountNumber login platform')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Deposit.countDocuments(query);

        res.json({
            success: true,
            data: deposits,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get deposits error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposits'
        });
    }
});

// ============================================
// GET SINGLE DEPOSIT
// ============================================
router.get('/deposits/:depositId', authenticateToken, async (req, res) => {
    try {
        const { depositId } = req.params;

        const deposit = await Deposit.findOne({
            _id: depositId,
            userId: req.user.userId
        }).populate('tradingAccountId', 'accountNumber login platform');

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found'
            });
        }

        res.json({
            success: true,
            data: deposit
        });
    } catch (error) {
        console.error('Get deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposit'
        });
    }
});

// ============================================
// CREATE WITHDRAWAL
// ============================================
router.post('/withdrawals', authenticateToken, async (req, res) => {
    try {
        const {
            tradingAccountId,
            amount,
            currency,
            withdrawalMethod,
            withdrawalDetails
        } = req.body;

        // Validation
        if (!tradingAccountId || !amount || !currency || !withdrawalMethod) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        // Verify account belongs to user and has sufficient balance
        const account = await TradingAccount.findOne({
            _id: tradingAccountId,
            userId: req.user.userId
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Trading account not found'
            });
        }

        if (account.balance < amount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient balance. Available: ${account.balance} ${currency}`
            });
        }

        // Get withdrawal method from settings to calculate fee
        const settings = await Settings.findOne();
        const methodConfig = settings?.withdrawalMethods?.find(m => m.id === withdrawalMethod || m.type === withdrawalMethod);

        // Calculate fee
        let fee = 0;
        if (methodConfig) {
            fee = methodConfig.fee || 0;
            if (methodConfig.feePercentage) {
                fee += (amount * methodConfig.feePercentage) / 100;
            }
        }

        const netAmount = amount - fee;

        // Generate transaction ID
        const transactionId = `WDR${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create withdrawal
        const withdrawal = new Withdrawal({
            userId: req.user.userId,
            tradingAccountId,
            transactionId,
            amount,
            currency,
            fee,
            netAmount,
            withdrawalMethod,
            withdrawalDetails,
            status: 'pending'
        });

        await withdrawal.save();

        // Deduct amount from account balance (pending withdrawal)
        account.balance -= amount;
        account.equity = account.balance;
        account.freeMargin = account.balance;
        await account.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request created successfully',
            data: {
                transactionId: withdrawal.transactionId,
                amount: withdrawal.amount,
                fee: withdrawal.fee,
                netAmount: withdrawal.netAmount,
                currency: withdrawal.currency,
                status: withdrawal.status,
                createdAt: withdrawal.createdAt
            }
        });
    } catch (error) {
        console.error('Create withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create withdrawal request'
        });
    }
});

// ============================================
// GET USER'S WITHDRAWALS
// ============================================
router.get('/withdrawals', authenticateToken, async (req, res) => {
    try {
        const {
            status,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        const query = { userId: req.user.userId };

        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const withdrawals = await Withdrawal.find(query)
            .populate('tradingAccountId', 'accountNumber login platform')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Withdrawal.countDocuments(query);

        res.json({
            success: true,
            data: withdrawals,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get withdrawals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch withdrawals'
        });
    }
});

// ============================================
// GET SINGLE WITHDRAWAL
// ============================================
router.get('/withdrawals/:withdrawalId', authenticateToken, async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        const withdrawal = await Withdrawal.findOne({
            _id: withdrawalId,
            userId: req.user.userId
        }).populate('tradingAccountId', 'accountNumber login platform');

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal not found'
            });
        }

        res.json({
            success: true,
            data: withdrawal
        });
    } catch (error) {
        console.error('Get withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch withdrawal'
        });
    }
});

// ============================================
// CANCEL WITHDRAWAL (Only if pending)
// ============================================
router.patch('/withdrawals/:withdrawalId/cancel', authenticateToken, async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        const withdrawal = await Withdrawal.findOne({
            _id: withdrawalId,
            userId: req.user.userId,
            status: 'pending'
        });

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal not found or cannot be cancelled'
            });
        }

        // Refund amount to account
        await TradingAccount.findByIdAndUpdate(
            withdrawal.tradingAccountId,
            {
                $inc: {
                    balance: withdrawal.amount,
                    equity: withdrawal.amount,
                    freeMargin: withdrawal.amount
                }
            }
        );

        withdrawal.status = 'cancelled';
        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal cancelled successfully',
            data: withdrawal
        });
    } catch (error) {
        console.error('Cancel withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel withdrawal'
        });
    }
});

// ============================================
// ADMIN ROUTES
// ============================================
// ============================================
// GET ALL DEPOSITS (Admin) - UPDATED WITH POPULATE
// ============================================
router.get('/admin/deposits', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { page = 1, limit = 1000, status, paymentMethod, search } = req.query;

        const query = {};

        if (status) query.status = status;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: 'i' } }
            ];
        }

        const deposits = await Deposit.find(query)
            .populate('userId', 'firstName lastName email phoneNumber country accountStatus')
            .populate('tradingAccountId', 'accountNumber login platform accountClass accountType currency balance status')
            .populate('processedBy', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .lean();

        const count = await Deposit.countDocuments(query);

        res.json({
            success: true,
            data: deposits,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get deposits error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposits'
        });
    }
});


// APPROVE/REJECT DEPOSIT (Admin)
router.patch('/admin/deposits/:depositId/status', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { depositId } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const deposit = await Deposit.findById(depositId);
        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found'
            });
        }

        // If approving deposit, credit the account
        if (status === 'completed' && deposit.status !== 'completed') {
            if (deposit.tradingAccountId) {
                await TradingAccount.findByIdAndUpdate(
                    deposit.tradingAccountId,
                    {
                        $inc: {
                            balance: deposit.amount,
                            equity: deposit.amount,
                            freeMargin: deposit.amount
                        }
                    }
                );
            }

            // Update user total deposits
            await User.findByIdAndUpdate(
                deposit.userId,
                { $inc: { totalDeposits: deposit.amount } }
            );

            deposit.completedAt = new Date();
        }

        deposit.status = status;
        deposit.adminNotes = adminNotes;
        deposit.processedBy = req.user.userId;
        deposit.processedAt = new Date();

        await deposit.save();

        res.json({
            success: true,
            message: `Deposit ${status} successfully`,
            data: deposit
        });
    } catch (error) {
        console.error('Update deposit status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update deposit status'
        });
    }
});

// ============================================
// CREATE TRANSFER
// ============================================
router.post('/transfers', authenticateToken, async (req, res) => {
    try {
        const {
            methodId,
            methodType,
            fromAccountId,
            toAccountId,
            recipientAccountNumber,
            recipientEmail,
            transferReason,
            amount,
            currency,
            metadata
        } = req.body;

        // Validation
        if (!amount || !currency || !methodId) {
            return res.status(400).json({
                success: false,
                message: 'Amount, currency, and method are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        // Generate transaction ID
        const transactionId = `TRF${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Between accounts transfer
        if (methodId === 'betweenaccounts') {
            if (!fromAccountId || !toAccountId) {
                return res.status(400).json({
                    success: false,
                    message: 'Source and destination accounts are required'
                });
            }

            if (fromAccountId === toAccountId) {
                return res.status(400).json({
                    success: false,
                    message: 'Source and destination accounts must be different'
                });
            }

            // Verify both accounts belong to user
            const fromAccount = await TradingAccount.findOne({
                _id: fromAccountId,
                userId: req.user.userId
            });

            const toAccount = await TradingAccount.findOne({
                _id: toAccountId,
                userId: req.user.userId
            });

            if (!fromAccount || !toAccount) {
                return res.status(404).json({
                    success: false,
                    message: 'One or both accounts not found'
                });
            }

            // Check sufficient balance
            if (fromAccount.balance < amount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient balance. Available: ${fromAccount.balance} ${currency}`
                });
            }

            // Create transfer record
            const transfer = new Transfer({
                userId: req.user.userId,
                fromAccountId,
                toAccountId,
                transactionId,
                amount,
                currency,
                fee: 0,
                netAmount: amount,
                transferType: 'between_accounts',
                methodId,
                methodType: methodType || 'internal',
                status: 'processing',
                processingTime: 'Instant',
                metadata: metadata || {}
            });

            await transfer.save();

            // Perform transfer
            fromAccount.balance -= amount;
            fromAccount.equity = fromAccount.balance;
            fromAccount.freeMargin = fromAccount.balance;
            await fromAccount.save();

            toAccount.balance += amount;
            toAccount.equity = toAccount.balance;
            toAccount.freeMargin = toAccount.balance;
            await toAccount.save();

            // Mark transfer as completed
            await transfer.markAsCompleted();
            await transfer.addAuditLog('completed', req.user.userId, 'Transfer completed successfully');

            res.status(201).json({
                success: true,
                message: 'Transfer completed successfully',
                data: {
                    transactionId: transfer.transactionId,
                    amount: transfer.amount,
                    currency: transfer.currency,
                    from: fromAccount.accountNumber,
                    to: toAccount.accountNumber,
                    status: transfer.status,
                    createdAt: transfer.createdAt,
                    completedAt: transfer.completedAt
                }
            });
        }

        // To another user transfer
        if (methodId === 'toanotheruser') {
            if (!fromAccountId || !recipientAccountNumber || !recipientEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Source account, recipient account number, and email are required'
                });
            }

            if (!transferReason) {
                return res.status(400).json({
                    success: false,
                    message: 'Transfer reason is required'
                });
            }

            // Verify source account belongs to user
            const fromAccount = await TradingAccount.findOne({
                _id: fromAccountId,
                userId: req.user.userId
            });

            if (!fromAccount) {
                return res.status(404).json({
                    success: false,
                    message: 'Source account not found'
                });
            }

            // Check sufficient balance
            if (fromAccount.balance < amount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient balance. Available: ${fromAccount.balance} ${currency}`
                });
            }

            // Find recipient by email and account number
            const recipientUser = await User.findOne({ email: recipientEmail });

            if (!recipientUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Recipient user not found'
                });
            }

            const recipientAccount = await TradingAccount.findOne({
                accountNumber: recipientAccountNumber,
                userId: recipientUser._id
            });

            if (!recipientAccount) {
                return res.status(404).json({
                    success: false,
                    message: 'Recipient account not found or does not match email'
                });
            }

            // Create transfer record
            const transfer = new Transfer({
                userId: req.user.userId,
                fromAccountId,
                toAccountId: recipientAccount._id,
                recipientUserId: recipientUser._id,
                recipientAccountNumber,
                recipientEmail,
                transferReason,
                transactionId,
                amount,
                currency,
                fee: 0,
                netAmount: amount,
                transferType: 'to_another_user',
                methodId,
                methodType: methodType || 'internal',
                status: 'processing',
                processingTime: '5-10 minutes',
                metadata: metadata || {}
            });

            await transfer.save();

            // Perform transfer
            fromAccount.balance -= amount;
            fromAccount.equity = fromAccount.balance;
            fromAccount.freeMargin = fromAccount.balance;
            await fromAccount.save();

            recipientAccount.balance += amount;
            recipientAccount.equity = recipientAccount.balance;
            recipientAccount.freeMargin = recipientAccount.balance;
            await recipientAccount.save();

            // Mark transfer as completed
            await transfer.markAsCompleted();
            await transfer.addAuditLog('completed', req.user.userId, `Transfer to ${recipientEmail} completed`);

            res.status(201).json({
                success: true,
                message: 'Transfer to another user completed successfully',
                data: {
                    transactionId: transfer.transactionId,
                    amount: transfer.amount,
                    currency: transfer.currency,
                    from: fromAccount.accountNumber,
                    to: recipientAccount.accountNumber,
                    recipient: recipientEmail,
                    reason: transferReason,
                    status: transfer.status,
                    createdAt: transfer.createdAt,
                    completedAt: transfer.completedAt
                }
            });
        }

    } catch (error) {
        console.error('Create transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create transfer'
        });
    }
});

// ============================================
// GET USER'S TRANSFERS
// ============================================
router.get('/transfers', authenticateToken, async (req, res) => {
    try {
        const {
            status,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        const query = {
            $or: [
                { userId: req.user.userId },
                { recipientUserId: req.user.userId }
            ]
        };

        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transfers = await Transfer.find(query)
            .populate('fromAccountId', 'accountNumber login platform')
            .populate('toAccountId', 'accountNumber login platform')
            .populate('recipientUserId', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Transfer.countDocuments(query);

        res.json({
            success: true,
            data: transfers,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get transfers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transfers'
        });
    }
});

// ============================================
// GET SINGLE TRANSFER
// ============================================
router.get('/transfers/:transferId', authenticateToken, async (req, res) => {
    try {
        const { transferId } = req.params;

        const transfer = await Transfer.findOne({
            _id: transferId,
            $or: [
                { userId: req.user.userId },
                { recipientUserId: req.user.userId }
            ]
        })
            .populate('fromAccountId', 'accountNumber login platform')
            .populate('toAccountId', 'accountNumber login platform')
            .populate('recipientUserId', 'firstName lastName email');

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: 'Transfer not found'
            });
        }

        res.json({
            success: true,
            data: transfer
        });
    } catch (error) {
        console.error('Get transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transfer'
        });
    }
});

// ============================================
// CANCEL TRANSFER (Only if pending)
// ============================================
router.patch('/transfers/:transferId/cancel', authenticateToken, async (req, res) => {
    try {
        const { transferId } = req.params;

        const transfer = await Transfer.findOne({
            _id: transferId,
            userId: req.user.userId,
            status: 'pending'
        });

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: 'Transfer not found or cannot be cancelled'
            });
        }

        // Refund amount to source account
        await TradingAccount.findByIdAndUpdate(
            transfer.fromAccountId,
            {
                $inc: {
                    balance: transfer.amount,
                    equity: transfer.amount,
                    freeMargin: transfer.amount
                }
            }
        );

        // If it was to another user, refund from recipient too
        if (transfer.toAccountId && transfer.transferType === 'to_another_user') {
            await TradingAccount.findByIdAndUpdate(
                transfer.toAccountId,
                {
                    $inc: {
                        balance: -transfer.amount,
                        equity: -transfer.amount,
                        freeMargin: -transfer.amount
                    }
                }
            );
        }

        await transfer.markAsCancelled('Cancelled by user');
        await transfer.addAuditLog('cancelled', req.user.userId, 'Transfer cancelled by user');

        res.json({
            success: true,
            message: 'Transfer cancelled successfully',
            data: transfer
        });
    } catch (error) {
        console.error('Cancel transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel transfer'
        });
    }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET ALL TRANSFERS (Admin)
router.get('/admin/transfers', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const {
            userId,
            status,
            transferType,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        const query = {};
        if (userId) query.userId = userId;
        if (status) query.status = status;
        if (transferType) query.transferType = transferType;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transfers = await Transfer.find(query)
            .populate('userId', 'firstName lastName email')
            .populate('fromAccountId', 'accountNumber login platform')
            .populate('toAccountId', 'accountNumber login platform')
            .populate('recipientUserId', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Transfer.countDocuments(query);

        res.json({
            success: true,
            data: transfers,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get all transfers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transfers'
        });
    }
});

// APPROVE/REJECT TRANSFER (Admin)
router.patch('/admin/transfers/:transferId/status', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { transferId } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const transfer = await Transfer.findById(transferId);
        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: 'Transfer not found'
            });
        }

        // If rejecting, refund the amount
        if (status === 'rejected' && transfer.status === 'pending') {
            await TradingAccount.findByIdAndUpdate(
                transfer.fromAccountId,
                {
                    $inc: {
                        balance: transfer.amount,
                        equity: transfer.amount,
                        freeMargin: transfer.amount
                    }
                }
            );

            if (transfer.toAccountId && transfer.transferType === 'to_another_user') {
                await TradingAccount.findByIdAndUpdate(
                    transfer.toAccountId,
                    {
                        $inc: {
                            balance: -transfer.amount,
                            equity: -transfer.amount,
                            freeMargin: -transfer.amount
                        }
                    }
                );
            }
        }

        transfer.status = status;
        transfer.adminNotes = adminNotes;
        transfer.processedBy = req.user.userId;
        transfer.processedAt = new Date();

        if (status === 'completed') {
            transfer.completedAt = new Date();
        }

        await transfer.save();
        await transfer.addAuditLog(status, req.user.userId, adminNotes || `Status changed to ${status}`);

        res.json({
            success: true,
            message: `Transfer ${status} successfully`,
            data: transfer
        });
    } catch (error) {
        console.error('Update transfer status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update transfer status'
        });
    }
});

// ============================================
// UPDATE DEPOSIT (Admin) - NEW ROUTE
// ============================================
router.patch('/admin/deposits/:depositId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { depositId } = req.params;
        const { amount, currency, paymentMethod, paymentDetails, adminNotes } = req.body;

        const deposit = await Deposit.findById(depositId);
        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found'
            });
        }

        // Update fields
        if (amount !== undefined) deposit.amount = amount;
        if (currency !== undefined) deposit.currency = currency;
        if (paymentMethod !== undefined) deposit.paymentMethod = paymentMethod;
        if (paymentDetails !== undefined) deposit.paymentDetails = paymentDetails;
        if (adminNotes !== undefined) deposit.adminNotes = adminNotes;

        deposit.processedBy = req.user.userId;
        deposit.processedAt = new Date();

        await deposit.save();

        res.json({
            success: true,
            message: 'Deposit updated successfully',
            data: deposit
        });
    } catch (error) {
        console.error('Update deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update deposit'
        });
    }
});

// ============================================
// DELETE DEPOSIT (Admin) - NEW ROUTE
// ============================================
router.delete('/admin/deposits/:depositId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { depositId } = req.params;

        const deposit = await Deposit.findById(depositId);
        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: 'Deposit not found'
            });
        }

        // If deposit was completed, refund the amount from user's account
        if (deposit.status === 'completed' && deposit.tradingAccountId) {
            await TradingAccount.findByIdAndUpdate(
                deposit.tradingAccountId,
                {
                    $inc: {
                        balance: -deposit.amount,
                        equity: -deposit.amount,
                        freeMargin: -deposit.amount
                    }
                }
            );

            // Update user total deposits
            await User.findByIdAndUpdate(
                deposit.userId,
                { $inc: { totalDeposits: -deposit.amount } }
            );
        }

        await Deposit.findByIdAndDelete(depositId);

        res.json({
            success: true,
            message: 'Deposit deleted successfully'
        });
    } catch (error) {
        console.error('Delete deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete deposit'
        });
    }
});

// ============================================
// GET ALL WITHDRAWALS (Admin) - WITH POPULATE
// ============================================
router.get('/admin/withdrawals', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { page = 1, limit = 1000, status, withdrawalMethod, search } = req.query;

        const query = {};

        if (status) query.status = status;
        if (withdrawalMethod) query.withdrawalMethod = withdrawalMethod;
        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: 'i' } }
            ];
        }

        const withdrawals = await Withdrawal.find(query)
            .populate('userId', 'firstName lastName email phoneNumber country accountStatus')
            .populate('tradingAccountId', 'accountNumber login platform accountClass accountType currency balance status')
            .populate('processedBy', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .lean();

        const count = await Withdrawal.countDocuments(query);

        res.json({
            success: true,
            data: withdrawals,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get withdrawals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch withdrawals'
        });
    }
});

// ============================================
// UPDATE WITHDRAWAL STATUS (Admin)
// ============================================
router.patch('/admin/withdrawals/:withdrawalId/status', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { withdrawalId } = req.params;
        const { status, adminNotes, rejectionReason, txHash } = req.body;

        const withdrawal = await Withdrawal.findById(withdrawalId)
            .populate('userId')
            .populate('tradingAccountId');

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal not found'
            });
        }

        const oldStatus = withdrawal.status;
        withdrawal.status = status;
        withdrawal.processedBy = req.user.userId;
        withdrawal.processedAt = new Date();

        if (adminNotes) withdrawal.adminNotes = adminNotes;
        if (rejectionReason) withdrawal.rejectionReason = rejectionReason;
        if (txHash && withdrawal.withdrawalDetails) {
            withdrawal.withdrawalDetails.txHash = txHash;
        }

        // If completing withdrawal, update account balance
        if (status === 'completed' && oldStatus !== 'completed') {
            withdrawal.completedAt = new Date();

            if (withdrawal.tradingAccountId) {
                await TradingAccount.findByIdAndUpdate(
                    withdrawal.tradingAccountId,
                    {
                        $inc: {
                            balance: -withdrawal.amount,
                            equity: -withdrawal.amount,
                            freeMargin: -withdrawal.amount
                        }
                    }
                );

                // Update user total withdrawals
                await User.findByIdAndUpdate(
                    withdrawal.userId,
                    { $inc: { totalWithdrawals: withdrawal.amount } }
                );
            }
        }

        // If rejecting/cancelling after it was completed, refund
        if ((status === 'rejected' || status === 'cancelled') && oldStatus === 'completed') {
            if (withdrawal.tradingAccountId) {
                await TradingAccount.findByIdAndUpdate(
                    withdrawal.tradingAccountId,
                    {
                        $inc: {
                            balance: withdrawal.amount,
                            equity: withdrawal.amount,
                            freeMargin: withdrawal.amount
                        }
                    }
                );

                await User.findByIdAndUpdate(
                    withdrawal.userId,
                    { $inc: { totalWithdrawals: -withdrawal.amount } }
                );
            }
        }

        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal status updated successfully',
            data: withdrawal
        });
    } catch (error) {
        console.error('Update withdrawal status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update withdrawal status'
        });
    }
});

// ============================================
// UPDATE WITHDRAWAL (Admin)
// ============================================
router.patch('/admin/withdrawals/:withdrawalId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { withdrawalId } = req.params;
        const { amount, currency, fee, netAmount, adminNotes } = req.body;

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal not found'
            });
        }

        // Update fields
        if (amount !== undefined) withdrawal.amount = amount;
        if (currency !== undefined) withdrawal.currency = currency;
        if (fee !== undefined) withdrawal.fee = fee;
        if (netAmount !== undefined) withdrawal.netAmount = netAmount;
        if (adminNotes !== undefined) withdrawal.adminNotes = adminNotes;

        withdrawal.processedBy = req.user.userId;
        withdrawal.processedAt = new Date();

        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal updated successfully',
            data: withdrawal
        });
    } catch (error) {
        console.error('Update withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update withdrawal'
        });
    }
});

// ============================================
// DELETE WITHDRAWAL (Admin)
// ============================================
router.delete('/admin/withdrawals/:withdrawalId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal not found'
            });
        }

        // If withdrawal was completed, refund the amount
        if (withdrawal.status === 'completed' && withdrawal.tradingAccountId) {
            await TradingAccount.findByIdAndUpdate(
                withdrawal.tradingAccountId,
                {
                    $inc: {
                        balance: withdrawal.amount,
                        equity: withdrawal.amount,
                        freeMargin: withdrawal.amount
                    }
                }
            );

            // Update user total withdrawals
            await User.findByIdAndUpdate(
                withdrawal.userId,
                { $inc: { totalWithdrawals: -withdrawal.amount } }
            );
        }

        await Withdrawal.findByIdAndDelete(withdrawalId);

        res.json({
            success: true,
            message: 'Withdrawal deleted successfully'
        });
    } catch (error) {
        console.error('Delete withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete withdrawal'
        });
    }
});

// ============================================
// CREATE BLOCKBEE DEPOSIT LINK (User)
// ============================================
// CREATE BLOCKBEE DEPOSIT LINK (User)
router.post('/blockbee/deposit/create', authenticateToken, async (req, res) => {
    try {
        const { tradingAccountId, suggestedAmount, description } = req.body;
        const userId = req.user.userId;

        // Get BlockBee settings from database
        let blockBeeSettings;
        try {
            blockBeeSettings = await getBlockBeeSettings();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (!blockBeeSettings) {
            return res.status(400).json({
                success: false,
                message: 'BlockBee is not configured. Please contact support.'
            });
        }

        // Validate trading account if provided
        if (tradingAccountId) {
            const account = await TradingAccount.findOne({
                _id: tradingAccountId,
                userId
            });

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Trading account not found'
                });
            }
        }

        // Validate amount
        const minAmount = blockBeeSettings.depositSettings?.minAmount || 10;
        const maxAmount = blockBeeSettings.depositSettings?.maxAmount || 100000;

        if (suggestedAmount && (suggestedAmount < minAmount || suggestedAmount > maxAmount)) {
            return res.status(400).json({
                success: false,
                message: `Deposit amount must be between ${minAmount} and ${maxAmount}`
            });
        }

        // ✅ FIX: Build notify_url with custom parameters
        const notifyParams = new URLSearchParams({
            user_id: userId,
            trading_account_id: tradingAccountId || ''
        });

        const notifyUrl = `${process.env.BASE_URL}/api/transactions/blockbee/webhook/deposit?${notifyParams.toString()}`;

        // Build BlockBee API request
        const params = new URLSearchParams({
            apikey: blockBeeSettings.apiKeyV2,
            notify_url: notifyUrl,
            currency: 'usd',
            item_description: description || 'Account Deposit',
            post: '1'
        });

        // Add suggested amount if provided
        if (suggestedAmount) {
            params.append('suggested_value', suggestedAmount);
        }

        console.log('BlockBee API Request URL:', `https://api.blockbee.io/deposit/request/?${params}`);

        // Call BlockBee API
        const response = await fetch(`https://api.blockbee.io/deposit/request/?${params}`);
        const result = await response.json();

        // Log full response for debugging
        console.log('BlockBee API Response:', JSON.stringify(result, null, 2));

        if (result.status === 'success') {
            // Generate transaction ID
            const transactionId = `DEP-BB-${Date.now()}${Math.floor(Math.random() * 1000)}`;

            // Create deposit record with BlockBee data
            const deposit = new Deposit({
                userId,
                tradingAccountId: tradingAccountId || null,
                transactionId,
                amount: suggestedAmount || 0,
                currency: 'USD',
                paymentMethod: 'blockbee-checkout',
                blockBee: {
                    paymentId: result.payment_id,
                    paymentUrl: result.payment_url,
                    blockBeeStatus: 'pending_payment'
                },
                status: 'pending'
            });

            await deposit.save();

            res.json({
                success: true,
                message: 'Deposit link created successfully',
                data: {
                    depositId: deposit._id,
                    transactionId: deposit.transactionId,
                    paymentUrl: result.payment_url,
                    paymentId: result.payment_id
                }
            });
        } else {
            // Log the error details from BlockBee
            console.error('BlockBee API Error:', result);
            throw new Error(result.error || 'Failed to create deposit link');
        }
    } catch (error) {
        console.error('BlockBee deposit link creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// CREATE BLOCKBEE CRYPTO DEPOSIT WITH DIRECT ADDRESS
// ============================================
router.post('/deposits/blockbee/create', authenticateToken, async (req, res) => {
    try {
        const { tradingAccountId, amount, ticker = 'bep20/usdt' } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
        }

        // Validate trading account if provided
        if (tradingAccountId) {
            const account = await TradingAccount.findOne({
                _id: tradingAccountId,
                userId
            });

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Trading account not found'
                });
            }
        }

        // Validate ticker
        const supportedTickers = ['bep20/usdt', 'trc20/usdt', 'btc', 'eth'];
        if (!supportedTickers.includes(ticker.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Ticker ${ticker} is not supported`
            });
        }

        // Generate unique UUID for this transaction
        const uuid = generateBlockBeeUUID();

        // Generate transaction ID
        const transactionId = `DEP-BB-${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Determine currency based on ticker
        let currency = 'USDT';
        if (ticker === 'btc') currency = 'BTC';
        else if (ticker === 'eth') currency = 'ETH';

        // Create deposit record
        const deposit = new Deposit({
            userId,
            tradingAccountId: tradingAccountId || null,
            transactionId,
            amount,
            currency,
            paymentMethod: 'blockbee-crypto',
            status: 'pending'
        });

        await deposit.save();

        // Initiate BlockBee payment address using PHP equivalent function
        const blockbeeResult = await initiate_blockbee(deposit, uuid, ticker);

        if (!blockbeeResult.status) {
            // Delete deposit if BlockBee initiation failed
            await Deposit.findByIdAndDelete(deposit._id);

            return res.status(400).json({
                success: false,
                message: blockbeeResult.error || 'Failed to create payment address'
            });
        }

        // Return success response with payment details
        res.status(201).json({
            success: true,
            message: 'BlockBee deposit created successfully',
            data: {
                depositId: deposit._id,
                transactionId: deposit.transactionId,
                amount: deposit.amount,
                currency: deposit.currency,
                paymentAddress: blockbeeResult.data.address_in,
                qrCode: blockbeeResult.data.qr_code,
                qrCodeUrl: blockbeeResult.data.qr_code_url || null,
                paymentUrl: blockbeeResult.data.payment_url || null,
                ticker: ticker,
                network: ticker.split('/')[0].toUpperCase(),
                status: deposit.status
            }
        });

    } catch (error) {
        console.error('Create BlockBee deposit error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create deposit'
        });
    }
});


// ============================================
// GET BLOCKBEE DEPOSIT HISTORY (User)
// ============================================
router.get('/blockbee/deposits/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const deposits = await Deposit.find({
            userId,
            paymentMethod: 'blockbee_checkout'
        })
            .populate('tradingAccountId', 'accountNumber login platform')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: deposits
        });
    } catch (error) {
        console.error('Get BlockBee deposit history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposit history'
        });
    }
});

// ============================================
// CHECK BLOCKBEE DEPOSIT LOGS (Admin/User)
// ============================================
router.get('/blockbee/deposits/logs/:paymentId', authenticateToken, async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Get API key from settings
        let blockBeeSettings;
        try {
            blockBeeSettings = await getBlockBeeSettings();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        const response = await fetch(
            `https://api.blockbee.io/deposit/logs/?apikey=${blockBeeSettings.apiKeyV2}&payment_id=${paymentId}`
        );
        const result = await response.json();

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get deposit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposit logs'
        });
    }
});

// ============================================
// BLOCKBEE WITHDRAWAL - CREATE REQUEST (User)
// ============================================
router.post('/blockbee/withdrawal/request', authenticateToken, async (req, res) => {
    try {
        const { tradingAccountId, amount, coin, walletAddress, network } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!tradingAccountId || !amount || !coin || !walletAddress) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: tradingAccountId, amount, coin, walletAddress'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero'
            });
        }

        // Verify account belongs to user and has sufficient balance
        const account = await TradingAccount.findOne({
            _id: tradingAccountId,
            userId
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Trading account not found'
            });
        }

        if (account.balance < amount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient balance. Available: ${account.balance} ${account.currency}`
            });
        }

        // Get withdrawal method settings to calculate fee
        const settings = await Settings.findOne();
        const methodConfig = settings?.withdrawalMethods?.find(m =>
            m.currencyType === coin.split('/')[0].toUpperCase() ||
            m.type === 'crypto'
        );

        // Calculate fee
        let fee = 0;
        if (methodConfig) {
            fee = methodConfig.fee || 0;
            if (methodConfig.feePercentage) {
                fee += (amount * methodConfig.feePercentage) / 100;
            }
        }

        const netAmount = amount - fee;

        // Generate transaction ID
        const transactionId = `WDR${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Determine coin name based on ticker
        const coinName = coin === 'bep20/usdt' ? 'BEP20 (USDT)' :
            coin === 'trc20/usdt' ? 'TRC20 (USDT)' :
                coin === 'erc20/usdt' ? 'ERC20 (USDT)' :
                    coin.toUpperCase();

        // Create withdrawal record
        const withdrawal = new Withdrawal({
            userId,
            tradingAccountId,
            transactionId,
            amount,
            currency: account.currency,
            fee,
            netAmount,
            withdrawalMethod: 'blockbee-crypto',
            withdrawalDetails: {
                cryptocurrency: coinName,
                walletAddress,
                network: network || coin.split('/')[0].toUpperCase()
            },
            blockBee: {
                coin: coinName,
                ticker: coin,
                blockBeeStatus: 'created',
                createdAt: new Date()
            },
            status: 'pending' // Will be approved by admin or auto-approved
        });

        await withdrawal.save();

        // Deduct amount from account balance immediately (pending withdrawal)
        account.balance -= amount;
        account.equity = account.balance;
        account.freeMargin = account.balance;
        await account.save();

        // TODO: In production, you would call BlockBee Payout API here
        // For now, we'll mark it as pending admin approval

        res.status(201).json({
            success: true,
            message: 'Withdrawal request created successfully',
            data: {
                transactionId: withdrawal.transactionId,
                amount: withdrawal.amount,
                fee: withdrawal.fee,
                netAmount: withdrawal.netAmount,
                currency: withdrawal.currency,
                walletAddress: walletAddress,
                network: network || coin.split('/')[0].toUpperCase(),
                status: withdrawal.status,
                createdAt: withdrawal.createdAt
            }
        });

    } catch (error) {
        console.error('BlockBee withdrawal request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create withdrawal request'
        });
    }
});

// ============================================
// BLOCKBEE WITHDRAWAL - BATCH PROCESS (Admin) - UPDATED
// ============================================
router.post('/blockbee/withdrawal/process-batch',
    authenticateToken,
    authorize(['admin', 'superadmin']),
    async (req, res) => {
        try {
            const { withdrawalIds } = req.body; // Optional: pass specific IDs

            // Get BlockBee settings from database
            const blockBeeSettings = await getBlockBeeSettings();

            // Get pending BlockBee withdrawals
            let query = {
                status: 'pending',
                withdrawalMethod: 'blockbee-crypto'
            };

            // If specific IDs provided, use them
            if (withdrawalIds && withdrawalIds.length > 0) {
                query._id = { $in: withdrawalIds };
            }

            const pendingWithdrawals = await Withdrawal.find(query);

            if (pendingWithdrawals.length === 0) {
                return res.json({
                    success: true,
                    message: 'No pending withdrawals to process'
                });
            }

            // Group by coin/ticker
            const withdrawalsByCoin = {};
            pendingWithdrawals.forEach(w => {
                const ticker = w.blockBee.ticker || 'bep20/usdt';
                if (!withdrawalsByCoin[ticker]) {
                    withdrawalsByCoin[ticker] = [];
                }
                withdrawalsByCoin[ticker].push(w);
            });

            const results = [];

            // Process each coin separately using bulk process
            for (const [ticker, withdrawals] of Object.entries(withdrawalsByCoin)) {
                try {
                    // Build outputs object for BlockBee
                    const outputs = {};
                    withdrawals.forEach(w => {
                        outputs[w.withdrawalDetails.walletAddress] = parseFloat(w.netAmount);
                    });

                    console.log(`Processing ${withdrawals.length} ${ticker} withdrawals...`);
                    console.log('Outputs:', outputs);

                    // Call BlockBee bulk process API
                    const response = await fetch(
                        `https://api.blockbee.io/${ticker}/payout/request/bulk/process/?apikey=${blockBeeSettings.apiKeyV2}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': blockBeeSettings.apiKeyV2
                            },
                            body: JSON.stringify({ outputs })
                        }
                    );

                    const result = await response.json();

                    console.log(`BlockBee Response for ${ticker}:`, JSON.stringify(result, null, 2));

                    if (result.status === 'success') {
                        const payoutId = result.payout_info.id;

                        // Update withdrawal records
                        for (const w of withdrawals) {
                            w.blockBee.payoutId = payoutId;
                            w.blockBee.blockBeeStatus = 'processing';
                            w.blockBee.lastStatusCheck = new Date();
                            w.status = 'processing';
                            w.processedBy = req.user.userId;
                            w.processedAt = new Date();
                            await w.save();
                        }

                        results.push({
                            ticker,
                            payoutId,
                            count: withdrawals.length,
                            status: 'success',
                            message: `${withdrawals.length} withdrawals processed`,
                            withdrawals: withdrawals.map(w => ({
                                transactionId: w.transactionId,
                                amount: w.netAmount,
                                address: w.withdrawalDetails.walletAddress
                            }))
                        });

                        console.log(`✅ Processed ${withdrawals.length} ${ticker} withdrawals. Payout ID: ${payoutId}`);

                    } else {
                        // Mark all as failed
                        for (const w of withdrawals) {
                            w.blockBee.blockBeeStatus = 'error';
                            w.blockBee.errorMessage = result.error || 'Failed to process';
                            w.status = 'failed';

                            // Refund to account
                            await TradingAccount.findByIdAndUpdate(
                                w.tradingAccountId,
                                {
                                    $inc: {
                                        balance: w.amount,
                                        equity: w.amount,
                                        freeMargin: w.amount
                                    }
                                }
                            );

                            await w.save();
                        }

                        results.push({
                            ticker,
                            count: withdrawals.length,
                            status: 'failed',
                            error: result.error || 'Unknown error'
                        });

                        console.error(`❌ Failed to process ${ticker} withdrawals:`, result.error);
                    }

                } catch (coinError) {
                    results.push({
                        ticker,
                        count: withdrawals.length,
                        status: 'error',
                        error: coinError.message
                    });

                    console.error(`Error processing ${ticker} withdrawals:`, coinError);
                }
            }

            res.json({
                success: true,
                message: 'Batch processing completed',
                results
            });

        } catch (error) {
            console.error('Batch processing error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

// ============================================
// CHECK BLOCKBEE PAYOUT STATUS (Admin/Cron) - UPDATED
// ============================================
router.post('/blockbee/withdrawal/check-status',
    authenticateToken,
    authorize(['admin', 'superadmin']),
    async (req, res) => {
        try {
            // Get BlockBee settings from database
            const blockBeeSettings = await getBlockBeeSettings();

            // Get processing withdrawals
            const processingWithdrawals = await Withdrawal.find({
                'blockBee.blockBeeStatus': { $in: ['processing', 'created'] },
                'blockBee.payoutId': { $exists: true }
            });

            if (processingWithdrawals.length === 0) {
                return res.json({
                    success: true,
                    message: 'No processing withdrawals to check'
                });
            }

            // Get unique payout IDs
            const payoutIds = [...new Set(processingWithdrawals.map(w => w.blockBee.payoutId))];

            const results = [];

            for (const payoutId of payoutIds) {
                try {
                    // Check status from BlockBee using correct endpoint
                    const response = await fetch(
                        `https://api.blockbee.io/payout/status/?apikey=${blockBeeSettings.apiKeyV2}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': blockBeeSettings.apiKeyV2
                            },
                            body: JSON.stringify({
                                payout_id: payoutId
                            })
                        }
                    );

                    const result = await response.json();

                    console.log(`Payout Status for ${payoutId}:`, JSON.stringify(result, null, 2));

                    if (result.status === 'success') {
                        const payoutStatus = result.payout_info.status;

                        // Update withdrawals with this payout ID
                        const withdrawalsToUpdate = processingWithdrawals.filter(
                            w => w.blockBee.payoutId === payoutId
                        );

                        for (const w of withdrawalsToUpdate) {
                            w.blockBee.blockBeeStatus = payoutStatus;
                            w.blockBee.lastStatusCheck = new Date();

                            if (payoutStatus === 'done') {
                                w.status = 'completed';
                                w.completedAt = new Date();

                                // Get tx hash if available
                                if (result.payout_info.txid) {
                                    w.blockBee.txHash = result.payout_info.txid;
                                    w.withdrawalDetails.txHash = result.payout_info.txid;
                                }

                                // Update user total withdrawals
                                await User.findByIdAndUpdate(w.userId, {
                                    $inc: { totalWithdrawals: w.amount }
                                });

                                console.log(`✅ Withdrawal ${w.transactionId} completed`);

                            } else if (payoutStatus === 'error') {
                                w.status = 'failed';
                                w.blockBee.errorMessage = result.payout_info.error || 'Unknown error';
                                w.rejectionReason = result.payout_info.error;

                                // Refund to account
                                await TradingAccount.findByIdAndUpdate(
                                    w.tradingAccountId,
                                    {
                                        $inc: {
                                            balance: w.amount,
                                            equity: w.amount,
                                            freeMargin: w.amount
                                        }
                                    }
                                );

                                console.log(`❌ Withdrawal ${w.transactionId} failed: ${result.payout_info.error}`);
                            }

                            await w.save();
                        }

                        results.push({
                            payoutId,
                            status: payoutStatus,
                            withdrawalCount: withdrawalsToUpdate.length
                        });

                    } else {
                        results.push({
                            payoutId,
                            error: result.error || 'Failed to fetch status'
                        });
                    }

                } catch (payoutError) {
                    console.error(`Error checking payout ${payoutId}:`, payoutError);
                    results.push({
                        payoutId,
                        error: payoutError.message
                    });
                }
            }

            res.json({
                success: true,
                message: 'Status check completed',
                results
            });

        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

// ============================================
// GET BLOCKBEE SELF-CUSTODIAL WALLET BALANCE (Admin)
// ============================================
router.get('/blockbee/wallet/balance/:coin', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { coin } = req.params;

        // Get BlockBee settings from database
        let blockBeeSettings;
        try {
            blockBeeSettings = await getBlockBeeSettings();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        const response = await fetch(
            `https://api.blockbee.io/${coin}/balance/?apikey=${blockBeeSettings.apiKeyV2}`
        );
        const result = await response.json();

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get wallet balance error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// BLOCKBEE WITHDRAWAL - PROCESS SINGLE (Admin) - UPDATED WITH BULK PROCESS
// ============================================
router.post('/admin/blockbee/withdrawal/process/:withdrawalId',
    authenticateToken,
    authorize(['admin', 'superadmin']),
    async (req, res) => {
        try {
            const { withdrawalId } = req.params;

            const withdrawal = await Withdrawal.findById(withdrawalId)
                .populate('userId')
                .populate('tradingAccountId');

            if (!withdrawal) {
                return res.status(404).json({
                    success: false,
                    message: 'Withdrawal not found'
                });
            }

            if (withdrawal.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Withdrawal is not in pending status'
                });
            }

            // Get BlockBee settings
            const blockBeeSettings = await getBlockBeeSettings();
            const apiKey = blockBeeSettings.apiKeyV2;

            const walletAddress = withdrawal.withdrawalDetails.walletAddress;
            const ticker = withdrawal.blockBee.ticker || 'bep20/usdt';
            const amount = withdrawal.netAmount;

            // Use BlockBee bulk/process endpoint for instant processing
            const outputs = {
                [walletAddress]: parseFloat(amount)
            };

            console.log('BlockBee Bulk Process Request:', {
                ticker,
                outputs,
                withdrawalId
            });

            // Call BlockBee bulk process API
            const response = await fetch(
                `https://api.blockbee.io/${ticker}/payout/request/bulk/process/?apikey=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': apiKey
                    },
                    body: JSON.stringify({ outputs })
                }
            );

            const result = await response.json();

            console.log('BlockBee Bulk Process Response:', JSON.stringify(result, null, 2));

            if (result.status === 'success') {
                // Update withdrawal with payout details
                withdrawal.blockBee.payoutId = result.payout_info.id;
                withdrawal.blockBee.blockBeeStatus = 'processing';
                withdrawal.blockBee.lastStatusCheck = new Date();
                withdrawal.status = 'processing';
                withdrawal.processedBy = req.user.userId;
                withdrawal.processedAt = new Date();

                await withdrawal.save();

                return res.json({
                    success: true,
                    message: 'Withdrawal payout initiated successfully',
                    data: {
                        transactionId: withdrawal.transactionId,
                        payoutId: result.payout_info.id,
                        status: 'processing'
                    }
                });
            } else {
                withdrawal.blockBee.blockBeeStatus = 'error';
                withdrawal.blockBee.errorMessage = result.error || 'Failed to create payout';
                withdrawal.status = 'failed';

                await withdrawal.save();

                return res.status(400).json({
                    success: false,
                    message: result.error || 'Failed to create BlockBee payout'
                });
            }

        } catch (error) {
            console.error('BlockBee withdrawal processing error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process withdrawal'
            });
        }
    });

// ============================================
// CHECK BLOCKBEE PAYOUT STATUS (Cron job or manual check)
// ============================================
router.get('/admin/blockbee/withdrawal/status/:withdrawalId',
    authenticateToken,
    authorize(['admin', 'superadmin']),
    async (req, res) => {
        try {
            const { withdrawalId } = req.params;

            const withdrawal = await Withdrawal.findById(withdrawalId);
            if (!withdrawal) {
                return res.status(404).json({
                    success: false,
                    message: 'Withdrawal not found'
                });
            }

            if (!withdrawal.blockBee?.payoutId) {
                return res.status(400).json({
                    success: false,
                    message: 'No BlockBee payout ID found'
                });
            }

            const blockBeeSettings = await getBlockBeeSettings();
            const apiKey = blockBeeSettings.apiKeyV2;
            const ticker = withdrawal.blockBee.ticker || 'bep20/usdt';
            const payoutId = withdrawal.blockBee.payoutId;

            // Check payout status
            const apiUrl = `https://api.blockbee.io/${ticker}/payout/info/?apikey=${apiKey}&payout_id=${payoutId}`;

            const response = await httpsGet(apiUrl);

            console.log('BlockBee Payout Status:', JSON.stringify(response, null, 2));

            if (response.status === 'success' && response.data) {
                const payoutData = response.data;

                // Update withdrawal based on status
                withdrawal.blockBee.blockBeeStatus = payoutData.status;
                withdrawal.blockBee.lastStatusCheck = new Date();

                if (payoutData.txid || payoutData.tx_hash) {
                    withdrawal.withdrawalDetails.txHash = payoutData.txid || payoutData.tx_hash;
                }

                if (payoutData.status === 'done' || payoutData.status === 'completed') {
                    withdrawal.status = 'completed';
                    withdrawal.completedAt = new Date();
                } else if (payoutData.status === 'error' || payoutData.status === 'failed') {
                    withdrawal.status = 'failed';
                    withdrawal.blockBee.errorMessage = payoutData.error || 'Payout failed';
                }

                await withdrawal.save();

                return res.json({
                    success: true,
                    data: {
                        transactionId: withdrawal.transactionId,
                        status: withdrawal.status,
                        blockBeeStatus: withdrawal.blockBee.blockBeeStatus,
                        txHash: withdrawal.withdrawalDetails.txHash
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to fetch payout status'
                });
            }

        } catch (error) {
            console.error('Check payout status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to check payout status'
            });
        }
    }
);

// ============================================
// BLOCKBEE CALLBACK HANDLER FOR DIRECT PAYMENTS
// ============================================
router.post('/blockbee/callback/:uuid', express.json(), async (req, res) => {
    try {
        const { uuid } = req.params;
        const webhookData = req.body;

        console.log('📥 BlockBee Callback:', uuid, webhookData);

        const deposit = await Deposit.findOne({ 'blockBee.uuid': uuid });
        if (!deposit) {
            console.error('❌ Deposit not found:', uuid);
            return res.status(200).send('ok');
        }

        // ✅ FIX: Log webhook but don't crash on duplicates
        try {
            await WebhookLog.create({
                uuid: `${uuid}-${webhookData.txid_in || Date.now()}`,
                userId: deposit.userId.toString(),
                type: 'blockbee-callback',
                payload: webhookData,
                processed: true,
                processedAt: new Date()
            });
        } catch (logError) {
            console.log('⚠️ Webhook log duplicate (non-critical)');
        }

        // ✅ FIX: Always update with latest blockchain data
        deposit.blockBee.txHash = webhookData.txid_in;
        deposit.blockBee.confirmations = webhookData.confirmations;
        deposit.blockBee.valueReceived = webhookData.value_coin;
        deposit.blockBee.valuePaid = webhookData.value_forwarded_coin;
        deposit.blockBee.lastCallbackAt = new Date();

        // ✅ FIX: Process only once when confirmed
        const shouldProcess =
            webhookData.confirmations >= 1 &&
            deposit.status !== 'completed';

        if (shouldProcess) {
            deposit.amount = parseFloat(webhookData.value_forwarded_coin);
            deposit.status = 'completed';
            deposit.completedAt = new Date();
            deposit.blockBee.isProcessed = true;
            deposit.blockBee.blockBeeStatus = 'completed';

            // Credit account
            if (deposit.tradingAccountId) {
                const account = await TradingAccount.findById(deposit.tradingAccountId);
                if (account) {
                    account.balance += parseFloat(webhookData.value_forwarded_coin);
                    account.equity = account.balance;
                    account.freeMargin = account.balance;
                    await account.save();
                }
            }

            // Update user totals
            await User.findByIdAndUpdate(deposit.userId, {
                $inc: { totalDeposits: parseFloat(webhookData.value_forwarded_coin) }
            });

            console.log('✅ Deposit auto-completed:', {
                transactionId: deposit.transactionId,
                amount: webhookData.value_forwarded_coin,
                confirmations: webhookData.confirmations
            });
        } else {
            console.log('⏳ Waiting for confirmations:', {
                confirmations: webhookData.confirmations,
                status: deposit.status
            });
        }

        await deposit.save();
        res.status(200).send('ok');

    } catch (error) {
        console.error('❌ Callback error:', error);
        res.status(200).send('ok');
    }
});

// ============================================
// BLOCKBEE DEPOSIT WEBHOOK HANDLER (Checkout)
// ============================================
router.post('/blockbee/webhook/deposit', express.json(), async (req, res) => {
    try {
        const webhookData = req.body;
        const { uuid, is_paid, status, paid_amount, paid_coin, txid_in, confirmations, payment_id } = webhookData;

        // ✅ FIX: Extract params from query string
        const userId = req.query.user_id || req.query.userid;
        const tradingAccountId = req.query.trading_account_id || req.query.tradingaccountid;

        console.log('📥 Webhook received:', {
            uuid, userId, tradingAccountId,
            is_paid, status, confirmations, paid_amount
        });

        // ✅ FIX: Log webhook but allow duplicates
        try {
            await WebhookLog.create({
                uuid: `${uuid}-${Date.now()}`,
                userId,
                type: 'deposit',
                payload: webhookData,
                processed: false,
                processedAt: new Date()
            });
        } catch (logError) {
            console.log('⚠️ Webhook log exists (non-critical)');
        }

        // Find or create deposit record
        let deposit = await Deposit.findOne({
            $or: [
                { 'blockBee.uuid': uuid },
                { 'blockBee.paymentId': payment_id }
            ]
        });

        if (!deposit) {
            const transactionId = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            deposit = new Deposit({
                userId,
                tradingAccountId: tradingAccountId || null,
                transactionId,
                amount: 0,
                currency: 'USDT',
                paymentMethod: 'blockbee_checkout',
                blockBee: {
                    uuid,
                    paymentId: payment_id,
                    blockBeeStatus: 'pending_payment'
                },
                status: 'pending'
            });
        }

        // ✅ FIX: Always update latest webhook data
        deposit.blockBee.coin = paid_coin;
        deposit.blockBee.paidAmount = paid_amount;
        deposit.blockBee.confirmations = confirmations;
        deposit.blockBee.blockBeeStatus = status;
        deposit.blockBee.txHash = txid_in;
        deposit.blockBee.lastWebhookAt = new Date();

        // ✅ FIX: Only process once when conditions are met
        const shouldProcess =
            is_paid === 1 &&
            confirmations >= 1 &&
            deposit.status !== 'completed';

        if (shouldProcess) {
            console.log('✅ Processing payment:', {
                transactionId: deposit.transactionId,
                amount: paid_amount,
                confirmations
            });

            deposit.amount = parseFloat(paid_amount);
            deposit.status = 'completed';
            deposit.completedAt = new Date();
            deposit.blockBee.isWebhookProcessed = true;
            deposit.blockBee.blockBeeStatus = 'completed';

            // Credit trading account
            if (tradingAccountId) {
                const account = await TradingAccount.findById(tradingAccountId);
                if (account) {
                    account.balance += parseFloat(paid_amount);
                    account.equity = account.balance;
                    account.freeMargin = account.balance;
                    await account.save();
                    console.log('💰 Account credited:', account.accountNumber);
                }
            }

            // Update user total deposits
            await User.findByIdAndUpdate(userId, {
                $inc: { totalDeposits: parseFloat(paid_amount) }
            });

            console.log('✅ Deposit completed:', deposit.transactionId);
        } else {
            console.log('⏳ Waiting for confirmations:', {
                is_paid,
                confirmations,
                currentStatus: deposit.status
            });
        }

        await deposit.save();
        res.status(200).send('ok');

    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(200).send('ok');
    }
});

// ============================================
// AUTO-CHECK SINGLE WITHDRAWAL STATUS
// ============================================
router.get('/withdrawals/:withdrawalId/check-status', authenticateToken, async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        const withdrawal = await Withdrawal.findOne({
            _id: withdrawalId,
            userId: req.user.userId
        });

        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found' });
        }

        // Only check if it has a payoutId and is in processing
        if (!withdrawal.blockBee?.payoutId || withdrawal.status === 'completed' || withdrawal.status === 'failed') {
            return res.json({
                success: true,
                data: {
                    status: withdrawal.status,
                    blockBeeStatus: withdrawal.blockBee?.blockBeeStatus,
                    txHash: withdrawal.withdrawalDetails?.txHash
                }
            });
        }

        // Fetch status from BlockBee
        const blockBeeSettings = await getBlockBeeSettings();
        const ticker = withdrawal.blockBee.ticker || 'bep20_usdt';
        const payoutId = withdrawal.blockBee.payoutId;

        const apiUrl = `https://api.blockbee.io/${ticker}/payout/info/?apikey=${blockBeeSettings.apiKeyV2}&payoutid=${payoutId}`;
        const response = await httpsGet(apiUrl);

        if (response.status === 'success' && response.data) {
            const payoutData = response.data;

            // Update withdrawal
            withdrawal.blockBee.blockBeeStatus = payoutData.status;
            withdrawal.blockBee.lastStatusCheck = new Date();

            if (payoutData.txid || payoutData.txhash) {
                withdrawal.withdrawalDetails.txHash = payoutData.txid || payoutData.txhash;
                withdrawal.blockBee.txHash = payoutData.txid || payoutData.txhash;
            }

            // ✅ FIX: Auto-complete when done
            if (payoutData.status === 'done' || payoutData.status === 'completed') {
                withdrawal.status = 'completed';
                withdrawal.completedAt = new Date();

                // Update user total withdrawals
                await User.findByIdAndUpdate(withdrawal.userId, {
                    $inc: { totalWithdrawals: withdrawal.amount }
                });

                console.log('✅ Withdrawal auto-completed:', withdrawal.transactionId);
            }
            // ✅ FIX: Auto-fail and refund if error
            else if (payoutData.status === 'error' || payoutData.status === 'failed') {
                withdrawal.status = 'failed';
                withdrawal.blockBee.errorMessage = payoutData.error || 'Payout failed';
                withdrawal.rejectionReason = payoutData.error;

                // Refund to account
                await TradingAccount.findByIdAndUpdate(withdrawal.tradingAccountId, {
                    $inc: {
                        balance: withdrawal.amount,
                        equity: withdrawal.amount,
                        freeMargin: withdrawal.amount
                    }
                });

                console.log('❌ Withdrawal failed and refunded:', withdrawal.transactionId);
            }

            await withdrawal.save();

            return res.json({
                success: true,
                data: {
                    status: withdrawal.status,
                    blockBeeStatus: withdrawal.blockBee.blockBeeStatus,
                    txHash: withdrawal.withdrawalDetails?.txHash
                }
            });
        }

        res.json({ success: false, message: 'Failed to fetch status from BlockBee' });
    } catch (error) {
        console.error('Withdrawal status check error:', error);
        res.status(500).json({ success: false, message: 'Failed to check withdrawal status' });
    }
});

export default router;
