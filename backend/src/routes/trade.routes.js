// backend/src/routes/trade.routes.js
import express from 'express';
import Trade from '../models/Trade.js';
import TradingAccount from '../models/TradingAccount.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import { calculateAndPayReferralCommission } from '../utils/referralCommission.js';

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

// GET ALL TRADES FOR USER
router.get('/my-trades', authenticateToken, async (req, res) => {
    try {
        const {
            accountId,
            status = 'all', // all, open, closed
            symbol,
            type,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        const query = { userId: req.user.userId };

        // Filter by account
        if (accountId) {
            query.tradingAccountId = accountId;
        }

        // Filter by status
        if (status !== 'all') {
            query.status = status;
        }

        // Filter by symbol
        if (symbol) {
            query.symbol = { $regex: symbol, $options: 'i' };
        }

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.openTime = {};
            if (startDate) query.openTime.$gte = new Date(startDate);
            if (endDate) query.openTime.$lte = new Date(endDate);
        }

        const trades = await Trade.find(query)
            .populate('tradingAccountId', 'accountNumber login platform accountClass')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ openTime: -1 });

        const count = await Trade.countDocuments(query);

        res.json({
            success: true,
            data: trades,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get trades error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trades'
        });
    }
});

// GET SINGLE TRADE
router.get('/my-trades/:tradeId', authenticateToken, async (req, res) => {
    try {
        const { tradeId } = req.params;

        const trade = await Trade.findOne({
            _id: tradeId,
            userId: req.user.userId
        }).populate('tradingAccountId', 'accountNumber login platform');

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            });
        }

        res.json({
            success: true,
            data: trade
        });
    } catch (error) {
        console.error('Get trade error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trade'
        });
    }
});

// CREATE TRADE (Simulated - for demo)
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const {
            tradingAccountId,
            symbol,
            type,
            lots,
            openPrice,
            stopLoss,
            takeProfit
        } = req.body;

        // Validate required fields
        if (!tradingAccountId || !symbol || !type || !lots || !openPrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Verify account belongs to user
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

        // Generate trade ID
        const tradeId = `T${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create trade
        const trade = new Trade({
            userId: req.user.userId,
            tradingAccountId,
            tradeId,
            symbol,
            type: type.toLowerCase(),
            openPrice,
            currentPrice: openPrice,
            lots,
            volume: lots * 100000, // Standard lot size
            stopLoss,
            takeProfit,
            status: 'open',
            platform: account.platform
        });

        await trade.save();

        // Add trade reference to account
        await TradingAccount.findByIdAndUpdate(
            tradingAccountId,
            { $push: { trades: trade._id } }
        );

        res.status(201).json({
            success: true,
            message: 'Trade created successfully',
            data: trade
        });
    } catch (error) {
        console.error('Create trade error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create trade'
        });
    }
});

// CLOSE TRADE
router.patch('/:tradeId/close', authenticateToken, async (req, res) => {
    try {
        const { tradeId } = req.params;
        const { closePrice } = req.body;

        if (!closePrice) {
            return res.status(400).json({
                success: false,
                message: 'Close price is required'
            });
        }

        const trade = await Trade.findOne({
            _id: tradeId,
            userId: req.user.userId,
            status: 'open'
        });

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found or already closed'
            });
        }

        // Calculate profit/loss (simplified)
        const priceDiff = trade.type === 'buy'
            ? closePrice - trade.openPrice
            : trade.openPrice - closePrice;

        const profitLoss = priceDiff * trade.volume / 100; // Simplified calculation
        const pips = priceDiff * 10000; // For 4-digit pairs

        // Update trade
        trade.closePrice = closePrice;
        trade.closeTime = new Date();
        trade.status = 'closed';
        trade.profitLoss = profitLoss;
        trade.pips = pips;

        await trade.save();

        // Update account balance
        await TradingAccount.findByIdAndUpdate(
            trade.tradingAccountId,
            {
                $inc: {
                    balance: profitLoss,
                    equity: profitLoss
                }
            }
        );

        // ===== CALCULATE & PAY REFERRAL COMMISSION =====
        await calculateAndPayReferralCommission(trade);
        // ===============================================

        res.json({
            success: true,
            message: 'Trade closed successfully',
            data: trade
        });
    } catch (error) {
        console.error('Close trade error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to close trade'
        });
    }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET ALL TRADES (Admin)
router.get('/all', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const {
            userId,
            accountId,
            status,
            symbol,
            page = 1,
            limit = 50
        } = req.query;

        const query = {};
        if (userId) query.userId = userId;
        if (accountId) query.tradingAccountId = accountId;
        if (status) query.status = status;
        if (symbol) query.symbol = { $regex: symbol, $options: 'i' };

        const trades = await Trade.find(query)
            .populate('userId', 'firstName lastName email')
            .populate('tradingAccountId', 'accountNumber login platform')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ openTime: -1 });

        const count = await Trade.countDocuments(query);

        res.json({
            success: true,
            data: trades,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        console.error('Get all trades error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trades'
        });
    }
});

// UPDATE TRADE (Admin)
router.patch('/:tradeId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { tradeId } = req.params;
        const updateData = req.body;

        const trade = await Trade.findByIdAndUpdate(
            tradeId,
            updateData,
            { new: true }
        );

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            });
        }

        // ===== IF ADMIN CLOSES TRADE, CALCULATE COMMISSION =====
        if (updateData.status === 'closed' && trade.status === 'closed') {
            await calculateAndPayReferralCommission(trade);
        }
        // =======================================================

        res.json({
            success: true,
            message: 'Trade updated successfully',
            data: trade
        });
    } catch (error) {
        console.error('Update trade error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update trade'
        });
    }
});

// DELETE TRADE (Admin)
router.delete('/:tradeId', authenticateToken, authorize(['admin', 'superadmin']), async (req, res) => {
    try {
        const { tradeId } = req.params;

        const trade = await Trade.findByIdAndDelete(tradeId);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            });
        }

        // Remove from account's trades array
        await TradingAccount.findByIdAndUpdate(
            trade.tradingAccountId,
            { $pull: { trades: trade._id } }
        );

        res.json({
            success: true,
            message: 'Trade deleted successfully'
        });
    } catch (error) {
        console.error('Delete trade error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete trade'
        });
    }
});

export default router;
