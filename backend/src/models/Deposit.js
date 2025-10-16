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
        enum: ['bank_transfer', 'crypto', 'wallet', 'blockbee_checkout'],  // ADDED blockbee_checkout
        required: true
    },
    paymentDetails: {
        // For Crypto (Manual)
        cryptocurrency: String,
        walletAddress: String,
        network: String,
        txHash: String,
        confirmations: Number,

        // For Bank
        bankName: String,
        accountNumber: String,
        accountHolderName: String,
        ifscCode: String,
        swiftCode: String,
        utrNumber: String,

        // For Wallet
        walletId: String
    },

    // BlockBee Integration Fields (NEW - for automated deposits)
    blockBee: {
        paymentId: String,              // BlockBee payment ID
        paymentUrl: String,             // Checkout URL
        uuid: String,                   // Unique webhook ID per transaction
        coin: String,                   // Crypto used (btc, eth, usdt_erc20, etc.)
        paidAmount: Number,             // Actual amount paid in crypto
        blockBeeStatus: {               // BlockBee-specific status
            type: String,
            enum: ['pending_payment', 'pending_confirmation', 'confirmed', 'done', 'expired'],
        },
        confirmations: Number,          // Blockchain confirmations
        lastWebhookAt: Date,            // Last webhook received time
        isWebhookProcessed: Boolean     // Prevent duplicate processing
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending',
        index: true
    },

    // Proof and Notes
    proofOfPayment: String,
    userNotes: String,
    adminNotes: String,

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

// Indexes
depositSchema.index({ userId: 1, status: 1, createdAt: -1 });
depositSchema.index({ 'blockBee.paymentId': 1 });
depositSchema.index({ 'blockBee.uuid': 1 });

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;
