// models/TradingAccount.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

    // ===== NEW: TRADER & INVESTOR PASSWORDS =====
    traderPassword: {
        type: String,
        required: true,
        select: false  // Hidden by default for security
    },
    investorPassword: {
        type: String,
        required: true,
        select: false  // Hidden by default for security
    },

    // TEMPORARY - Store plain passwords until email is sent
    plainTraderPassword: {
        type: String,
        required: false,
        select: false
    },
    plainInvestorPassword: {
        type: String,
        required: false,
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

    // Nickname
    nickname: {
        type: String,
        default: ''
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

// Hash trader password before saving
tradingAccountSchema.pre('save', async function (next) {
    if (!this.isModified('traderPassword') || !this.traderPassword) return next();
    this.traderPassword = await bcrypt.hash(this.traderPassword, 12);
    next();
});

// Hash investor password before saving
tradingAccountSchema.pre('save', async function (next) {
    if (!this.isModified('investorPassword') || !this.investorPassword) return next();
    this.investorPassword = await bcrypt.hash(this.investorPassword, 12);
    next();
});

// Compare trader password method
tradingAccountSchema.methods.compareTraderPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.traderPassword);
};

// Compare investor password method
tradingAccountSchema.methods.compareInvestorPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.investorPassword);
};

// Index for querying user's accounts
tradingAccountSchema.index({ userId: 1, accountType: 1 });

const TradingAccount = mongoose.model('TradingAccount', tradingAccountSchema);
export default TradingAccount;
