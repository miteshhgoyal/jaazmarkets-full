// models/Trade.js
import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    tradingAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradingAccount',
        required: true,
        index: true
    },

    // Trade Details
    tradeId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    symbol: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },

    // Pricing
    openPrice: {
        type: Number,
        required: true
    },
    closePrice: Number,
    currentPrice: Number,

    // Volume & Lots
    volume: {
        type: Number,
        required: true
    },
    lots: {
        type: Number,
        required: true
    },

    // Profit/Loss
    profitLoss: {
        type: Number,
        default: 0
    },
    pips: {
        type: Number,
        default: 0
    },

    // Stop Loss & Take Profit
    stopLoss: Number,
    takeProfit: Number,

    // Swap & Commission
    swap: {
        type: Number,
        default: 0
    },
    commission: {
        type: Number,
        default: 0
    },

    // Status & Timing
    status: {
        type: String,
        enum: ['open', 'closed', 'cancelled'],
        default: 'open',
        index: true
    },
    openTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    closeTime: Date,

    // Platform Info
    platform: {
        type: String,
        enum: ['MT4', 'MT5', 'cTrader']
    },
    comment: String
}, {
    timestamps: true
});

// Indexes for queries
tradeSchema.index({ userId: 1, status: 1, openTime: -1 });
tradeSchema.index({ tradingAccountId: 1, status: 1 });
tradeSchema.index({ symbol: 1, status: 1 });

const Trade = mongoose.model('Trade', tradeSchema);
export default Trade;
