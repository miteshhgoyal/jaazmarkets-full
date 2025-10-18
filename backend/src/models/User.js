// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // User ID - Platform specific unique identifier
    userId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    // Authentication
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    traderPassword: {
        type: String,
        required: false,
        select: false
    },
    plainTraderPassword: {
        type: String,
        required: false,
    },

    investorPassword: {
        type: String,
        required: false,
        select: false
    },
    plainInvestorPassword: {
        type: String,
        required: false,
    },

    // Role
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user',
        index: true
    },

    // Personal Info
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: Date,
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    // Account Number
    accountNumber: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },

    // Address
    country: String,
    state: String,
    city: String,
    address: String,
    postalCode: String,

    // Account Status
    isVerified: {
        type: Boolean,
        default: false,
        index: true
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'pending', 'closed'],
        default: 'pending',
        index: true
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'submitted', 'approved', 'rejected'],
        default: 'pending'
    },

    // Trading Accounts Reference
    tradingAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradingAccount'
    }],

    // Wallet Balance
    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
        default: 'USD'
    },

    // Statistics
    totalDeposits: {
        type: Number,
        default: 0
    },
    totalWithdrawals: {
        type: Number,
        default: 0
    },

    // Security
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    lastLogin: Date,

    // Password Reset
    resetPasswordOTP: String,
    resetPasswordOTPExpiry: Date,

    // Terminal Preferences
    preferredMT5Terminal: {
        type: String,
        enum: ['MT5 WebTerminal', 'MT5 Desktop', 'MT5 Mobile'],
        default: null
    },
    preferredMT4Terminal: {
        type: String,
        enum: ['MT4 WebTerminal', 'MT4 Desktop', 'MT4 Mobile'],
        default: null
    },

    referralCode: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    referralEarnings: {
        type: Number,
        default: 0
    },
    totalReferrals: {
        type: Number,
        default: 0
    },

    emailVerificationOTP: {
        type: String,
        select: false
    },
    emailVerificationOTPExpiry: {
        type: Date,
        select: false
    },

}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Hash trader password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('traderPassword') || !this.traderPassword) return next();

    // Store plain text temporarily if it exists
    if (this.traderPassword && !this.plainTraderPassword) {
        this.plainTraderPassword = this.traderPassword;
    }

    this.traderPassword = await bcrypt.hash(this.traderPassword, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Compare trader password method
userSchema.methods.compareTraderPassword = async function (candidateTraderPassword) {
    return await bcrypt.compare(candidateTraderPassword, this.traderPassword);
};

// Generate OTP
userSchema.methods.generateResetOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.resetPasswordOTP = otp;
    this.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

const User = mongoose.model('User', userSchema);
export default User;
