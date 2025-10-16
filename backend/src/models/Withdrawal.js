// models/Withdrawal.js
import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    tradingAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradingAccount',
        index: true
    },

    // Transaction Details
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    fee: {
        type: Number,
        default: 0
    },
    netAmount: {
        type: Number,
        required: true
    },

    // Payment Method
    withdrawalMethod: {
        type: String,
        enum: ['bank_transfer', 'crypto', 'wallet'],
        required: true
    },
    withdrawalDetails: {
        // For Crypto
        cryptocurrency: String,
        walletAddress: String,
        network: String,
        txHash: String,

        // For Bank
        bankName: String,
        accountNumber: String,
        accountHolderName: String,
        ifscCode: String,
        swiftCode: String,

        // For Wallet
        walletId: String
    },

    // BlockBee Integration Fields (NEW - for automated payouts)
    blockBee: {
        payoutId: String,              // BlockBee payout batch ID
        payoutRequestId: String,       // Individual payout request ID
        coin: String,                  // Crypto ticker (btc, eth, usdt_erc20, etc.)
        blockBeeStatus: {              // BlockBee-specific status
            type: String,
            enum: ['created', 'processing', 'done', 'error'],
        },
        txHash: String,                // Blockchain transaction hash
        lastStatusCheck: Date,         // Last time status was checked
        errorMessage: String,          // Error from BlockBee if any
        createdAt: Date                // When added to BlockBee
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'rejected', 'cancelled'],
        default: 'pending',
        index: true
    },

    // Processing
    adminNotes: String,
    rejectionReason: String,
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Indexes
withdrawalSchema.index({ userId: 1, status: 1, createdAt: -1 });
withdrawalSchema.index({ 'blockBee.payoutId': 1 });
withdrawalSchema.index({ 'blockBee.blockBeeStatus': 1 });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
