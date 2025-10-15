// models/Deposit.js
import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
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

    // Payment Method
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'crypto', 'card', 'wallet'],
        required: true
    },
    paymentDetails: {
        // For Crypto
        cryptocurrency: String,
        walletAddress: String,
        network: String,
        txHash: String,

        // For Bank
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        utrNumber: String,

        // For Card
        cardLast4: String,
        cardType: String
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending',
        index: true
    },

    // Proof & Notes
    proofOfPayment: String,
    adminNotes: String,
    userNotes: String,

    // Processing
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Index for queries
depositSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;
