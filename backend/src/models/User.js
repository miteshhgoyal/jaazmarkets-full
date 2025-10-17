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
    tradingPassword: {
        type: String,
        required: false,
        select: false
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
    }

}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Hash trading password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('tradingPassword') || !this.tradingPassword) return next();
    this.tradingPassword = await bcrypt.hash(this.tradingPassword, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Compare trading password method
userSchema.methods.compareTradingPassword = async function (candidateTradingPassword) {
    return await bcrypt.compare(candidateTradingPassword, this.tradingPassword);
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
