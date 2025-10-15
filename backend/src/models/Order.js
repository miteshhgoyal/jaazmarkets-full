// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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

    // Order Details
    orderId: {
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
        enum: ['buy_limit', 'sell_limit', 'buy_stop', 'sell_stop'],
        required: true
    },

    // Pricing
    orderPrice: {
        type: Number,
        required: true
    },
    currentPrice: Number,

    // Volume
    volume: {
        type: Number,
        required: true
    },
    lots: {
        type: Number,
        required: true
    },

    // Stop Loss & Take Profit
    stopLoss: Number,
    takeProfit: Number,

    // Status
    status: {
        type: String,
        enum: ['pending', 'executed', 'cancelled', 'expired'],
        default: 'pending',
        index: true
    },

    // Timing
    placedAt: {
        type: Date,
        default: Date.now
    },
    executedAt: Date,
    expiresAt: Date,

    // Platform Info
    platform: {
        type: String,
        enum: ['MT4', 'MT5', 'cTrader']
    },
    comment: String
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ userId: 1, status: 1, placedAt: -1 });
orderSchema.index({ tradingAccountId: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
