// models/Settings.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Account Types Configuration
    accountTypes: [{
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ['Standard accounts', 'Professional accounts'],
            required: true
        },
        description: String,
        image: String,
        minDeposit: String,
        minSpread: String,
        maxLeverage: String,
        commission: String,
        features: [String],
        isActive: {
            type: Boolean,
            default: true
        }
    }],

    // Currency Options
    currencies: [{
        code: {
            type: String,
            required: true
        },
        name: String,
        symbol: String,
        isActive: {
            type: Boolean,
            default: true
        }
    }],

    // Leverage Options
    leverageOptions: [{
        type: String,
        enum: ['1:50', '1:100', '1:200', '1:500', '1:1000', '1:2000', '1:Unlimited']
    }],

    // Platform Options
    platforms: [{
        name: {
            type: String,
            enum: ['MT4', 'MT5', 'cTrader']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        serverUrl: String
    }],

    // Payment Methods
    paymentMethods: {
        crypto: {
            enabled: {
                type: Boolean,
                default: true
            },
            cryptocurrencies: [{
                name: String,
                symbol: String,
                network: String,
                walletAddress: String,
                minDeposit: Number,
                minWithdrawal: Number,
                isActive: {
                    type: Boolean,
                    default: true
                }
            }]
        },
        bankTransfer: {
            enabled: {
                type: Boolean,
                default: true
            },
            minDeposit: Number,
            minWithdrawal: Number,
            processingTime: String
        }
    },

    // Trading Settings
    tradingSettings: {
        minTradeSize: {
            type: Number,
            default: 0.01
        },
        maxTradeSize: {
            type: Number,
            default: 100
        },
        defaultStopLoss: Number,
        defaultTakeProfit: Number,
        maxOpenTrades: {
            type: Number,
            default: 200
        }
    },

    // Fees & Charges
    fees: {
        withdrawalFee: {
            type: Number,
            default: 0
        },
        withdrawalFeePercentage: {
            type: Number,
            default: 0
        },
        inactivityFee: {
            type: Number,
            default: 0
        },
        inactivityDays: {
            type: Number,
            default: 90
        }
    },

    // System Settings
    systemSettings: {
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        registrationEnabled: {
            type: Boolean,
            default: true
        },
        kycRequired: {
            type: Boolean,
            default: true
        },
        minWithdrawal: {
            type: Number,
            default: 10
        },
        maxWithdrawal: {
            type: Number,
            default: 50000
        }
    },

    // PAYMENT METHODS FOR DEPOSITS
    depositMethods: [{
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, enum: ['crypto', 'bank', 'card', 'wallet'], required: true },
        currencyType: String, // BTC, USDT, INR, etc.
        network: String, // ERC20, TRC20, BTC, etc.
        walletAddress: String, // For crypto
        minDeposit: { type: Number, required: true },
        maxDeposit: Number,
        fee: { type: Number, default: 0 },
        feePercentage: { type: Number, default: 0 },
        processingTime: String,
        image: String,
        description: String,
        isActive: { type: Boolean, default: true },
        recommended: { type: Boolean, default: false },
        bankDetails: {
            bankName: String,
            accountNumber: String,
            accountHolderName: String,
            ifscCode: String,
            swiftCode: String,
            branchName: String
        }
    }],

    // PAYMENT METHODS FOR WITHDRAWALS
    withdrawalMethods: [{
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, enum: ['crypto', 'bank', 'wallet'], required: true },
        currencyType: String,
        network: String,
        minWithdrawal: { type: Number, required: true },
        maxWithdrawal: Number,
        fee: { type: Number, default: 0 },
        feePercentage: { type: Number, default: 0 },
        processingTime: String,
        image: String,
        description: String,
        limits: String,
        isActive: { type: Boolean, default: true },
        recommended: { type: Boolean, default: false }
    }],

    // Referral Settings
    referralSettings: {
        enabled: {
            type: Boolean,
            default: true
        },
        commissionPercentage: {
            type: Number,
            default: 0.01,
            min: 0,
            max: 5
        },
        minPayoutAmount: {
            type: Number,
            default: 10
        },
        payoutMethod: {
            type: String,
            enum: ['wallet', 'manual'],
            default: 'wallet'
        }
    },

    // Updated By
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
