// models/TradingAccount.js
import mongoose from 'mongoose';

const tradingAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Account Details
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },

    // Account Type
    accountType: {
        type: String,
        enum: ['Real', 'Demo'],
        required: true,
        index: true
    },
    platform: {
        type: String,
        enum: ['MT4', 'MT5', 'cTrader'],
        required: true
    },
    accountClass: {
        type: String,
        enum: ['Standard', 'Standard Cent', 'Pro', 'Raw Spread', 'Zero'],
        required: true
    },

    // Financial
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
        default: 'USD'
    },
    equity: {
        type: Number,
        default: 0
    },
    freeMargin: {
        type: Number,
        default: 0
    },
    floatingPL: {
        type: Number,
        default: 0
    },
    marginLevel: {
        type: String,
        default: '∞'
    },

    // Trading Settings
    leverage: {
        type: String,
        enum: ['1:50', '1:100', '1:200', '1:500', '1:1000', '1:2000', '1:Unlimited'],
        default: '1:100'
    },
    server: {
        type: String,
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'suspended', 'closed'],
        default: 'active',
        index: true
    },

    // Orders Reference
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],

    // Trades Reference
    trades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade'
    }]
}, {
    timestamps: true
});

// Index for querying user's accounts
tradingAccountSchema.index({ userId: 1, accountType: 1 });

const TradingAccount = mongoose.model('TradingAccount', tradingAccountSchema);
export default TradingAccount;
