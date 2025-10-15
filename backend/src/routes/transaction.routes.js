import express from 'express';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import TradingAccount from '../models/TradingAccount.js';
import Transfer from '../models/Transfer.js';
import User from '../models/User.js';
import Settings from '../models/Setting.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

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

export default router;
