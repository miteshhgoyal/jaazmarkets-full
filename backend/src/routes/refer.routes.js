import express from "express";
import User from "../models/User.js";
import Trade from "../models/Trade.js";
import TradingAccount from "../models/TradingAccount.js";
import Settings from "../models/Setting.js";
import { authenticateToken, authorize } from "../middlewares/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

// GET MY REFERRAL INFO
router.get("/my-referral", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "email firstName lastName referralEarnings"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const referralLink = `${process.env.FRONTEND_URL}/register?ref=${user.email}`;
        const totalReferrals = await User.countDocuments({ referredBy: req.user.userId });

        res.json({
            success: true,
            data: {
                referralCode: user.email,
                referralLink,
                email: user.email,
                totalEarnings: user.referralEarnings || 0,
                totalReferrals,
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
// ADMIN ROUTES
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
                payoutMethod: "wallet",
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
});

// UPDATE REFERRAL SETTINGS
router.put("/admin/settings", authenticateToken, authorize("admin", "superadmin"), async (req, res) => {
    try {
        const { enabled, commissionPercentage, minPayoutAmount, payoutMethod } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (enabled !== undefined) settings.referralSettings.enabled = enabled;
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
            { $group: { _id: null, total: { $sum: "$referralEarnings" } } }
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
