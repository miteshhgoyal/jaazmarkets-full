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
            enum: ['Standard accounts', 'Professional accounts', 'Premium accounts', 'VIP accounts'],
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
        },
        minDeposit: {
            type: Number,
            default: 10
        },
        maxDeposit: {
            type: Number,
            default: 100000
        }
    },

    // BlockBee Configuration (NEW - replaces deposit/withdrawal methods)
    blockBeeSettings: {

        apiKeyV2: {
            type: String,
            required: false
        },


        // Supported coins for deposits/withdrawals
        supportedCoins: [{
            ticker: String,          // btc, eth, usdt_erc20, usdt_trc20, etc.
            name: String,            // Bitcoin, Ethereum, etc.
            network: String,         // BTC, ETH, ERC20, TRC20, etc.
            isActive: Boolean,
            minDeposit: Number,
            minWithdrawal: Number,
            icon: String
        }],
        // Deposit-specific settings
        depositSettings: {
            minAmount: {
                type: Number,
                default: 10
            },
            maxAmount: {
                type: Number,
                default: 100000
            },
            
        },
        // Withdrawal-specific settings
        withdrawalSettings: {
            minAmount: {
                type: Number,
                default: 10
            },
            maxAmount: {
                type: Number,
                default: 50000
            },
            feePercentage: {
                type: Number,
                default: 0
            },
            fixedFee: {
                type: Number,
                default: 0
            }
        }
    },

    // Referral Settings
    referralSettings: {

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
