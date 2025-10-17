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
        enum: ['USD', 'EUR', 'GBP', 'INR', 'BTC', 'ETH', 'USDT'],  // ✅ ADDED CRYPTO CURRENCIES
        default: 'USD'
    },

    // Payment Method
    paymentMethod: {
        type: String,
        enum: [
            'bank_transfer',
            'crypto',
            'wallet',
            'blockbee_checkout',
            'blockbee-crypto'      // ✅ ADDED - Direct BlockBee crypto address
        ],
        required: true
    },
    paymentDetails: {
        // For Crypto (Manual)
        cryptocurrency: {
            type: String,
            enum: ['BTC', 'ETH', 'USDT', 'BEP20 (USDT)', 'TRC20 (USDT)', 'ERC20 (USDT)', null]  // ✅ ADDED ENUM
        },
        walletAddress: String,
        network: {
            type: String,
            enum: ['BTC', 'ETH', 'ERC20', 'BEP20', 'TRC20', 'BSC', 'TRON', null]  // ✅ ADDED ENUM
        },
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
        coin: {
            type: String,
            enum: ['BTC', 'ETH', 'BEP20 (USDT)', 'TRC20 (USDT)', 'ERC20 (USDT)', null]  // ✅ ADDED ENUM
        },
        ticker: {
            type: String,
            enum: ['btc', 'eth', 'bep20/usdt', 'trc20/usdt', 'erc20/usdt', null]  // ✅ ADDED ENUM
        },
        address: String,                // ✅ ADDED - Generated payment address
        qrCode: String,                 // ✅ ADDED - Base64 QR code
        qrCodeUrl: String,              // ✅ ADDED - QR code image URL
        callbackUrl: String,            // ✅ ADDED - Webhook callback URL
        apiResponse: Object,            // ✅ ADDED - Full API response
        paidAmount: Number,             // Actual amount paid in crypto
        valueReceived: Number,          // ✅ ADDED - Value received in crypto
        valuePaid: Number,              // ✅ ADDED - Value forwarded/paid
        txHash: String,                 // ✅ ADDED - Transaction hash
        blockBeeStatus: {               // BlockBee-specific status
            type: String,
            enum: [
                'initiated',            // ✅ ADDED
                'pending_payment',
                'pending_confirmation',
                'confirmed',
                'completed',            // ✅ ADDED
                'done',
                'expired',
                'failed'                // ✅ ADDED
            ],
            default: 'initiated'
        },
        confirmations: Number,          // Blockchain confirmations
        isProcessed: {                  // ✅ ADDED - Prevent duplicate processing
            type: Boolean,
            default: false
        },
        lastWebhookAt: Date,            // Last webhook received time
        lastCallbackAt: Date,           // ✅ ADDED - Last callback received time
        isWebhookProcessed: Boolean,    // Prevent duplicate processing
        createdAt: Date                 // ✅ ADDED - When BlockBee address was created
    },

    // ✅ ADDED - PHP compatibility fields (from initiate_blockbee function)
    blockbee_coin: String,              // Coin name for display
    blockbee_address: String,           // Payment address
    api_response: String,               // JSON string of API response
    data: Object,                       // Full response object

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
depositSchema.index({ 'blockBee.address': 1 });        // ✅ ADDED
depositSchema.index({ 'blockBee.txHash': 1 });         // ✅ ADDED
depositSchema.index({ 'blockBee.blockBeeStatus': 1 }); // ✅ ADDED

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;
