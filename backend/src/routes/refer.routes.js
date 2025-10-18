import express from "express";
import User from "../models/User.js";
import Trade from "../models/Trade.js";
import TradingAccount from "../models/TradingAccount.js";
import Settings from "../models/Setting.js";
import Withdrawal from "../models/Withdrawal.js";
import { authenticateToken, authorize } from "../middlewares/auth.js";

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

// GET MY REFERRAL INFO
router.get("/my-referral", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "userId email firstName lastName referralEarnings totalReferrals"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const referralLink = `${process.env.FRONTEND_URL}/register?ref=${user.userId}`;

        // Get total trades volume from all referred users
        const referredUsers = await User.find({ referredBy: req.user.userId }).select("_id");
        const referredUserIds = referredUsers.map((u) => u._id);

        const trades = await Trade.find({
            userId: { $in: referredUserIds },
            status: "closed",
        }).select("volume openPrice");

        const settings = await Settings.findOne();
        const commissionRate = settings?.referralSettings?.commissionPercentage || 0.01;

        let totalVolume = 0;
        trades.forEach((trade) => {
            const tradeAmount = trade.volume * trade.openPrice;
            totalVolume += tradeAmount;
        });

        res.json({
            success: true,
            data: {
                referralCode: user.userId,
                referralLink,
                email: user.email,
                totalEarnings: user.referralEarnings || 0,
                totalReferrals: user.totalReferrals || 0,
                totalVolume: totalVolume || 0,
                commissionRate,
            },
        });
    } catch (error) {
        console.error("Get referral info error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch referral info" });
    }
});

// GET MY REFERRED USERS
router.get("/my-referrals", authenticateToken, async (req, res) => {
    try {
        const settings = await Settings.findOne();
        const commissionRate = settings?.referralSettings?.commissionPercentage || 0.01;

        const referredUsers = await User.find({ referredBy: req.user.userId })
            .select("firstName lastName email createdAt")
            .sort({ createdAt: -1 });

        const referralsWithDetails = await Promise.all(
            referredUsers.map(async (user) => {
                const accounts = await TradingAccount.find({ userId: user._id }).select(
                    "accountNumber accountType balance equity platform leverage"
                );

                const totalTrades = await Trade.countDocuments({
                    userId: user._id,
                    status: "closed",
                });

                const trades = await Trade.find({
                    userId: user._id,
                    status: "closed",
                }).select("volume openPrice profitLoss");

                let totalTradeAmount = 0;
                let totalProfitLoss = 0;
                let totalVolume = 0;

                trades.forEach((trade) => {
                    const tradeAmount = trade.volume * trade.openPrice;
                    totalTradeAmount += tradeAmount;
                    totalProfitLoss += trade.profitLoss || 0;
                    totalVolume += trade.volume || 0;
                });

                const myCommission = (totalTradeAmount * commissionRate) / 100;

                return {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    joinedAt: user.createdAt,
                    accounts: accounts.map((acc) => ({
                        accountNumber: acc.accountNumber,
                        type: acc.accountType,
                        balance: acc.balance,
                        equity: acc.equity,
                        platform: acc.platform,
                        leverage: acc.leverage,
                    })),
                    stats: {
                        totalAccounts: accounts.length,
                        totalTrades,
                        totalTradeAmount,
                        totalProfitLoss,
                        totalVolume,
                        myCommission,
                    },
                };
            })
        );

        res.json({
            success: true,
            data: {
                referrals: referralsWithDetails,
                total: referredUsers.length,
                commissionRate,
            },
        });
    } catch (error) {
        console.error("Get referrals error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch referrals" });
    }
});

// GET REFERRED USER'S TRADES
router.get("/referral/:userId/trades", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const referredUser = await User.findOne({
            _id: userId,
            referredBy: req.user.userId,
        });

        if (!referredUser) {
            return res.status(403).json({
                success: false,
                message: "You can only view trades of users you referred",
            });
        }

        const settings = await Settings.findOne();
        const commissionRate = settings?.referralSettings?.commissionPercentage || 0.01;

        const trades = await Trade.find({
            userId,
            status: "closed",
        })
            .populate("tradingAccountId", "accountNumber")
            .sort({ closeTime: -1 })
            .limit(100);

        const tradesWithCommission = trades.map((trade) => {
            const tradeAmount = trade.volume * trade.openPrice;
            const commission = (tradeAmount * commissionRate) / 100;

            return {
                id: trade._id,
                tradeId: trade.tradeId,
                symbol: trade.symbol,
                type: trade.type,
                volume: trade.volume,
                openPrice: trade.openPrice,
                closePrice: trade.closePrice,
                openTime: trade.openTime,
                closeTime: trade.closeTime,
                tradeAmount,
                profitLoss: trade.profitLoss,
                myCommission: commission,
                accountNumber: trade.tradingAccountId?.accountNumber,
            };
        });

        res.json({
            success: true,
            data: {
                trades: tradesWithCommission,
                total: trades.length,
                commissionRate,
            },
        });
    } catch (error) {
        console.error("Get referral trades error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch trades" });
    }
});

// ============================================
// WITHDRAW REFERRAL COMMISSION 
// ============================================
router.post('/withdraw-commission',
    authenticateToken,
    async (req, res) => {
        try {
            const { amount, walletAddress, currency = 'USDT', network = 'TRC20' } = req.body;

            // Validation
            if (!amount || !walletAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount and wallet address are required'
                });
            }

            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check minimum payout amount from settings
            const settings = await Settings.findOne();
            const minPayout = settings?.referralSettings?.minPayoutAmount || 10;

            if (amount < minPayout) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum withdrawal amount is $${minPayout}`
                });
            }

            if (user.referralEarnings < amount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient commission balance. Available: $${user.referralEarnings.toFixed(2)}`
                });
            }

            // Validate wallet address format
            if (network === 'TRC20' && !walletAddress.startsWith('T')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid TRC20 wallet address. Must start with T'
                });
            }

            if (network === 'ERC20' && !walletAddress.startsWith('0x')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ERC20 wallet address. Must start with 0x'
                });
            }

            // Generate transaction ID
            const transactionId = `REF-WD-${Date.now()}${Math.floor(Math.random() * 1000)}`;

            // Determine BlockBee ticker based on network
            let ticker = 'bep20/usdt'; // default
            if (network === 'TRC20') {
                ticker = 'trc20/usdt';
            } else if (network === 'ERC20') {
                ticker = 'erc20/usdt';
            } else if (network === 'BTC') {
                ticker = 'btc';
            }

            // Create withdrawal record FIRST
            const withdrawal = new Withdrawal({
                userId: req.user.userId,
                tradingAccountId: null, // No trading account - this is from referral earnings
                transactionId,
                amount,
                currency,
                fee: 0, // No fee for referral commission withdrawals
                netAmount: amount,
                withdrawalMethod: 'referral-commission',
                withdrawalDetails: {
                    type: 'referral-commission',
                    walletAddress,
                    network,
                    cryptocurrency: currency
                },
                blockBee: {
                    ticker,
                    blockBeeStatus: 'creating'
                },
                status: 'pending'
            });

            await withdrawal.save();

            // Deduct from user's referral earnings IMMEDIATELY (prevents double withdrawal)
            user.referralEarnings -= amount;
            await user.save();

            // Get BlockBee settings
            let blockBeeSettings;
            try {
                const settingsDoc = await Settings.findOne();
                if (!settingsDoc || !settingsDoc.blockBeeSettings) {
                    throw new Error('BlockBee settings not configured');
                }
                blockBeeSettings = settingsDoc.blockBeeSettings;

                if (!blockBeeSettings.apiKeyV2 || blockBeeSettings.apiKeyV2.trim() === '') {
                    throw new Error('BlockBee API key is not configured');
                }
            } catch (error) {
                // Refund if BlockBee not configured
                user.referralEarnings += amount;
                await user.save();

                withdrawal.status = 'failed';
                withdrawal.blockBee.blockBeeStatus = 'error';
                withdrawal.blockBee.errorMessage = error.message;
                await withdrawal.save();

                return res.status(400).json({
                    success: false,
                    message: 'Payment gateway not configured. Contact admin.'
                });
            }

            // Try to create BlockBee payout using bulk/process
            try {
                const outputs = {
                    [walletAddress]: parseFloat(amount)
                };

                console.log('BlockBee Commission Payout Request:', {
                    ticker,
                    outputs,
                    transactionId
                });

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

                console.log('BlockBee Commission Payout Response:', JSON.stringify(result, null, 2));

                if (result.status === 'success') {
                    // Update withdrawal with payout details
                    withdrawal.blockBee.payoutId = result.payout_info.id;
                    withdrawal.blockBee.blockBeeStatus = 'processing';
                    withdrawal.blockBee.lastStatusCheck = new Date();
                    withdrawal.status = 'processing';
                    withdrawal.processedAt = new Date();

                    await withdrawal.save();

                    return res.status(201).json({
                        success: true,
                        message: 'Commission withdrawal initiated successfully! Processing on blockchain...',
                        data: {
                            transactionId: withdrawal.transactionId,
                            amount: withdrawal.amount,
                            currency: withdrawal.currency,
                            walletAddress,
                            network,
                            status: withdrawal.status,
                            payoutId: result.payout_info.id,
                            createdAt: withdrawal.createdAt
                        }
                    });

                } else {
                    // BlockBee payout creation failed - refund user
                    user.referralEarnings += amount;
                    await user.save();

                    withdrawal.status = 'failed';
                    withdrawal.blockBee.blockBeeStatus = 'error';
                    withdrawal.blockBee.errorMessage = result.error || 'Failed to create payout';

                    await withdrawal.save();

                    return res.status(400).json({
                        success: false,
                        message: result.error || 'Failed to process withdrawal. Please try again later.'
                    });
                }

            } catch (blockBeeError) {
                console.error('BlockBee API Error:', blockBeeError);

                // Refund user on error
                user.referralEarnings += amount;
                await user.save();

                withdrawal.status = 'failed';
                withdrawal.blockBee.blockBeeStatus = 'error';
                withdrawal.blockBee.errorMessage = blockBeeError.message;

                await withdrawal.save();

                return res.status(500).json({
                    success: false,
                    message: 'Payment processing failed. Amount has been refunded to your balance.'
                });
            }

        } catch (error) {
            console.error('Commission withdrawal error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create commission withdrawal'
            });
        }
    });

// GET MY COMMISSION WITHDRAWALS
router.get("/commission-withdrawals", authenticateToken, async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({
            userId: req.user.userId,
            withdrawalMethod: "referral-commission",
        })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: withdrawals,
        });
    } catch (error) {
        console.error("Get commission withdrawals error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch withdrawals",
        });
    }
});

// ============================================
// ADMIN ROUTES (Keep your existing admin routes)
// ============================================

// GET REFERRAL SETTINGS
router.get("/admin/settings", authenticateToken, authorize("admin", "superadmin"), async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json({
            success: true,
            data: settings?.referralSettings || {
                enabled: true,
                commissionPercentage: 0.01,
                minPayoutAmount: 10,
                payoutMethod: "manual",
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
});

// UPDATE REFERRAL SETTINGS
router.put("/admin/settings", authenticateToken, authorize("admin", "superadmin"), async (req, res) => {
    try {
        const { commissionPercentage, minPayoutAmount, payoutMethod } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (commissionPercentage !== undefined)
            settings.referralSettings.commissionPercentage = commissionPercentage;
        if (minPayoutAmount !== undefined)
            settings.referralSettings.minPayoutAmount = minPayoutAmount;
        if (payoutMethod !== undefined)
            settings.referralSettings.payoutMethod = payoutMethod;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: "Referral settings updated successfully",
            data: settings.referralSettings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update settings" });
    }
});

// GET ALL REFERRAL STATS (Admin)
router.get("/admin/stats", authenticateToken, authorize("admin", "superadmin"), async (req, res) => {
    try {
        const totalReferrers = await User.countDocuments({ totalReferrals: { $gt: 0 } });
        const totalReferred = await User.countDocuments({ referredBy: { $ne: null } });

        const totalEarnings = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$referralEarnings" } } },
        ]);

        const topReferrers = await User.find({ totalReferrals: { $gt: 0 } })
            .select("firstName lastName email totalReferrals referralEarnings")
            .sort({ totalReferrals: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                totalReferrers,
                totalReferred,
                totalEarningsPaid: totalEarnings[0]?.total || 0,
                topReferrers,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
});

export default router;
