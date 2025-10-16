import express from 'express';
import Settings from '../models/Setting.js';
import { authenticateToken, authorize } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorize(['admin', 'superadmin']));

// Helper function to get or create settings document
const getOrCreateSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings({
            accountTypes: [],
            currencies: [],
            leverageOptions: [],
            platforms: [],
            tradingSettings: {
                minTradeSize: 0.01,
                maxTradeSize: 100,
                maxOpenTrades: 200
            },
            fees: {
                withdrawalFee: 0,
                withdrawalFeePercentage: 0,
                inactivityFee: 0,
                inactivityDays: 90
            },
            systemSettings: {
                maintenanceMode: false,
                registrationEnabled: true,
                kycRequired: true,
                minWithdrawal: 10,
                maxWithdrawal: 50000,
                minDeposit: 10,
                maxDeposit: 100000
            },
            blockBeeSettings: {
                enabled: false,
                apiKeyV2: 'AoxpSRGjhuBkaUIS6Oj4tN23qWWYsElY1wC62iqkKZ1I',
                supportedCoins: [],
                depositSettings: {
                    minAmount: 10,
                    maxAmount: 100000,
                },
                withdrawalSettings: {
                    minAmount: 10,
                    maxAmount: 50000,
                    
                    feePercentage: 0,
                    fixedFee: 0
                }
            },
            referralSettings: {
                enabled: true,
                commissionPercentage: 0.01,
                minPayoutAmount: 10,
                payoutMethod: 'wallet'
            }
        });
        await settings.save();
    }
    return settings;
};

// ==================== GET ALL SETTINGS ====================
router.get('/all', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get all settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
});

// ==================== ACCOUNT TYPES CRUD ====================

// GET ALL ACCOUNT TYPES
router.get('/account-types', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.accountTypes,
            total: settings.accountTypes.length
        });
    } catch (error) {
        console.error('Get account types error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account types'
        });
    }
});

// GET SINGLE ACCOUNT TYPE
router.get('/account-types/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const accountType = settings.accountTypes.find(at => at.id === req.params.id);

        if (!accountType) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        res.json({
            success: true,
            data: accountType
        });
    } catch (error) {
        console.error('Get account type error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account type'
        });
    }
});

// CREATE ACCOUNT TYPE
router.post('/account-types', async (req, res) => {
    try {
        const { name, category, description, image, minDeposit, minSpread, maxLeverage, commission, features, isActive } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name and category are required'
            });
        }

        const settings = await getOrCreateSettings();

        const newAccountType = {
            id: uuidv4(),
            name,
            category,
            description: description || '',
            image: image || '',
            minDeposit: minDeposit || '',
            minSpread: minSpread || '',
            maxLeverage: maxLeverage || '',
            commission: commission || '',
            features: features || [],
            isActive: isActive !== undefined ? isActive : true
        };

        settings.accountTypes.push(newAccountType);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Account type created successfully',
            data: newAccountType
        });
    } catch (error) {
        console.error('Create account type error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account type'
        });
    }
});

// UPDATE ACCOUNT TYPE
router.put('/account-types/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.accountTypes.findIndex(at => at.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        const { name, category, description, image, minDeposit, minSpread, maxLeverage, commission, features, isActive } = req.body;

        if (name !== undefined) settings.accountTypes[index].name = name;
        if (category !== undefined) settings.accountTypes[index].category = category;
        if (description !== undefined) settings.accountTypes[index].description = description;
        if (image !== undefined) settings.accountTypes[index].image = image;
        if (minDeposit !== undefined) settings.accountTypes[index].minDeposit = minDeposit;
        if (minSpread !== undefined) settings.accountTypes[index].minSpread = minSpread;
        if (maxLeverage !== undefined) settings.accountTypes[index].maxLeverage = maxLeverage;
        if (commission !== undefined) settings.accountTypes[index].commission = commission;
        if (features !== undefined) settings.accountTypes[index].features = features;
        if (isActive !== undefined) settings.accountTypes[index].isActive = isActive;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Account type updated successfully',
            data: settings.accountTypes[index]
        });
    } catch (error) {
        console.error('Update account type error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update account type'
        });
    }
});

// DELETE ACCOUNT TYPE
router.delete('/account-types/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.accountTypes.findIndex(at => at.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        settings.accountTypes.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Account type deleted successfully'
        });
    } catch (error) {
        console.error('Delete account type error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account type'
        });
    }
});

// ==================== CURRENCIES CRUD ====================

// GET ALL CURRENCIES
router.get('/currencies', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.currencies,
            total: settings.currencies.length
        });
    } catch (error) {
        console.error('Get currencies error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch currencies'
        });
    }
});

// CREATE CURRENCY
router.post('/currencies', async (req, res) => {
    try {
        const { code, name, symbol, isActive } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Currency code is required'
            });
        }

        const settings = await getOrCreateSettings();

        const newCurrency = {
            code,
            name: name || '',
            symbol: symbol || '',
            isActive: isActive !== undefined ? isActive : true
        };

        settings.currencies.push(newCurrency);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Currency created successfully',
            data: newCurrency
        });
    } catch (error) {
        console.error('Create currency error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create currency'
        });
    }
});

// UPDATE CURRENCY
router.put('/currencies/:code', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.currencies.findIndex(c => c.code === req.params.code);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Currency not found'
            });
        }

        const { name, symbol, isActive } = req.body;

        if (name !== undefined) settings.currencies[index].name = name;
        if (symbol !== undefined) settings.currencies[index].symbol = symbol;
        if (isActive !== undefined) settings.currencies[index].isActive = isActive;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Currency updated successfully',
            data: settings.currencies[index]
        });
    } catch (error) {
        console.error('Update currency error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update currency'
        });
    }
});

// DELETE CURRENCY
router.delete('/currencies/:code', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.currencies.findIndex(c => c.code === req.params.code);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Currency not found'
            });
        }

        settings.currencies.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Currency deleted successfully'
        });
    } catch (error) {
        console.error('Delete currency error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete currency'
        });
    }
});

// ==================== LEVERAGE OPTIONS CRUD ====================

// GET ALL LEVERAGE OPTIONS
router.get('/leverage-options', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.leverageOptions,
            total: settings.leverageOptions.length
        });
    } catch (error) {
        console.error('Get leverage options error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leverage options'
        });
    }
});

// ADD LEVERAGE OPTION
router.post('/leverage-options', async (req, res) => {
    try {
        const { option } = req.body;

        if (!option) {
            return res.status(400).json({
                success: false,
                message: 'Leverage option is required'
            });
        }

        const settings = await getOrCreateSettings();

        if (settings.leverageOptions.includes(option)) {
            return res.status(400).json({
                success: false,
                message: 'Leverage option already exists'
            });
        }

        settings.leverageOptions.push(option);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Leverage option added successfully',
            data: option
        });
    } catch (error) {
        console.error('Add leverage option error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add leverage option'
        });
    }
});

// DELETE LEVERAGE OPTION
router.delete('/leverage-options/:option', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.leverageOptions.indexOf(req.params.option);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Leverage option not found'
            });
        }

        settings.leverageOptions.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Leverage option deleted successfully'
        });
    } catch (error) {
        console.error('Delete leverage option error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete leverage option'
        });
    }
});

// ==================== PLATFORMS CRUD ====================

// GET ALL PLATFORMS
router.get('/platforms', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.platforms,
            total: settings.platforms.length
        });
    } catch (error) {
        console.error('Get platforms error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch platforms'
        });
    }
});

// CREATE PLATFORM
router.post('/platforms', async (req, res) => {
    try {
        const { name, isActive, serverUrl } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Platform name is required'
            });
        }

        const settings = await getOrCreateSettings();

        const newPlatform = {
            name,
            isActive: isActive !== undefined ? isActive : true,
            serverUrl: serverUrl || ''
        };

        settings.platforms.push(newPlatform);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Platform created successfully',
            data: newPlatform
        });
    } catch (error) {
        console.error('Create platform error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create platform'
        });
    }
});

// UPDATE PLATFORM
router.put('/platforms/:name', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.platforms.findIndex(p => p.name === req.params.name);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Platform not found'
            });
        }

        const { isActive, serverUrl } = req.body;

        if (isActive !== undefined) settings.platforms[index].isActive = isActive;
        if (serverUrl !== undefined) settings.platforms[index].serverUrl = serverUrl;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Platform updated successfully',
            data: settings.platforms[index]
        });
    } catch (error) {
        console.error('Update platform error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update platform'
        });
    }
});

// DELETE PLATFORM
router.delete('/platforms/:name', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.platforms.findIndex(p => p.name === req.params.name);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Platform not found'
            });
        }

        settings.platforms.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Platform deleted successfully'
        });
    } catch (error) {
        console.error('Delete platform error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete platform'
        });
    }
});

// ==================== BLOCKBEE SETTINGS (NEW) ====================

// GET BLOCKBEE SETTINGS
router.get('/blockbee-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        // Mask API keys in response (security)
        const blockBeeSettings = settings.blockBeeSettings ? settings.blockBeeSettings.toObject() : {};
        if (blockBeeSettings.apiKeyV2 && blockBeeSettings.apiKeyV2.length > 4) {
            blockBeeSettings.apiKeyV2 = '***' + blockBeeSettings.apiKeyV2.slice(-4);
        }

        res.json({
            success: true,
            data: blockBeeSettings
        });
    } catch (error) {
        console.error('Get BlockBee settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch BlockBee settings'
        });
    }
});

// UPDATE BLOCKBEE SETTINGS
router.put('/blockbee-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const {
            apiKeyV2,

            supportedCoins,
            depositSettings,
            withdrawalSettings
        } = req.body;

        if (apiKeyV2 !== undefined && !apiKeyV2.startsWith('***')) {
            settings.blockBeeSettings.apiKeyV2 = apiKeyV2;
        }

        if (supportedCoins !== undefined) settings.blockBeeSettings.supportedCoins = supportedCoins;
        if (depositSettings !== undefined) {
            settings.blockBeeSettings.depositSettings = {
                ...settings.blockBeeSettings.depositSettings.toObject(),
                ...depositSettings
            };
        }
        if (withdrawalSettings !== undefined) {
            settings.blockBeeSettings.withdrawalSettings = {
                ...settings.blockBeeSettings.withdrawalSettings.toObject(),
                ...withdrawalSettings
            };
        }

        settings.updatedBy = req.user.userId;
        await settings.save();

        // Mask API key in response
        const response = settings.blockBeeSettings.toObject();
        if (response.apiKeyV2 && response.apiKeyV2.length > 4) {
            response.apiKeyV2 = '***' + response.apiKeyV2.slice(-4);
        }

        res.json({
            success: true,
            message: 'BlockBee settings updated successfully',
            data: response
        });
    } catch (error) {
        console.error('Update BlockBee settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update BlockBee settings'
        });
    }
});

// ADD SUPPORTED COIN TO BLOCKBEE
router.post('/blockbee-settings/coins', async (req, res) => {
    try {
        const { ticker, name, network, isActive, minDeposit, minWithdrawal, icon } = req.body;

        if (!ticker || !name || !network) {
            return res.status(400).json({
                success: false,
                message: 'Ticker, name, and network are required'
            });
        }

        const settings = await getOrCreateSettings();

        // Check if coin already exists
        const existingCoin = settings.blockBeeSettings.supportedCoins.find(c => c.ticker === ticker);
        if (existingCoin) {
            return res.status(400).json({
                success: false,
                message: 'Coin already exists'
            });
        }

        const newCoin = {
            ticker,
            name,
            network,
            isActive: isActive !== undefined ? isActive : true,
            minDeposit: minDeposit || 10,
            minWithdrawal: minWithdrawal || 10,
            icon: icon || ''
        };

        settings.blockBeeSettings.supportedCoins.push(newCoin);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Supported coin added successfully',
            data: newCoin
        });
    } catch (error) {
        console.error('Add supported coin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add supported coin'
        });
    }
});

// UPDATE SUPPORTED COIN
router.put('/blockbee-settings/coins/:ticker', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.blockBeeSettings.supportedCoins.findIndex(c => c.ticker === req.params.ticker);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Coin not found'
            });
        }

        const { name, network, isActive, minDeposit, minWithdrawal, icon } = req.body;

        if (name !== undefined) settings.blockBeeSettings.supportedCoins[index].name = name;
        if (network !== undefined) settings.blockBeeSettings.supportedCoins[index].network = network;
        if (isActive !== undefined) settings.blockBeeSettings.supportedCoins[index].isActive = isActive;
        if (minDeposit !== undefined) settings.blockBeeSettings.supportedCoins[index].minDeposit = minDeposit;
        if (minWithdrawal !== undefined) settings.blockBeeSettings.supportedCoins[index].minWithdrawal = minWithdrawal;
        if (icon !== undefined) settings.blockBeeSettings.supportedCoins[index].icon = icon;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Supported coin updated successfully',
            data: settings.blockBeeSettings.supportedCoins[index]
        });
    } catch (error) {
        console.error('Update supported coin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update supported coin'
        });
    }
});

// DELETE SUPPORTED COIN
router.delete('/blockbee-settings/coins/:ticker', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.blockBeeSettings.supportedCoins.findIndex(c => c.ticker === req.params.ticker);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Coin not found'
            });
        }

        settings.blockBeeSettings.supportedCoins.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Supported coin deleted successfully'
        });
    } catch (error) {
        console.error('Delete supported coin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete supported coin'
        });
    }
});

// ==================== TRADING SETTINGS ====================

// GET TRADING SETTINGS
router.get('/trading-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.tradingSettings
        });
    } catch (error) {
        console.error('Get trading settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trading settings'
        });
    }
});

// UPDATE TRADING SETTINGS
router.put('/trading-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { minTradeSize, maxTradeSize, defaultStopLoss, defaultTakeProfit, maxOpenTrades } = req.body;

        if (minTradeSize !== undefined) settings.tradingSettings.minTradeSize = minTradeSize;
        if (maxTradeSize !== undefined) settings.tradingSettings.maxTradeSize = maxTradeSize;
        if (defaultStopLoss !== undefined) settings.tradingSettings.defaultStopLoss = defaultStopLoss;
        if (defaultTakeProfit !== undefined) settings.tradingSettings.defaultTakeProfit = defaultTakeProfit;
        if (maxOpenTrades !== undefined) settings.tradingSettings.maxOpenTrades = maxOpenTrades;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Trading settings updated successfully',
            data: settings.tradingSettings
        });
    } catch (error) {
        console.error('Update trading settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update trading settings'
        });
    }
});

// ==================== FEES SETTINGS ====================

// GET FEES SETTINGS
router.get('/fees', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.fees
        });
    } catch (error) {
        console.error('Get fees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fees'
        });
    }
});

// UPDATE FEES SETTINGS
router.put('/fees', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { withdrawalFee, withdrawalFeePercentage, inactivityFee, inactivityDays } = req.body;

        if (withdrawalFee !== undefined) settings.fees.withdrawalFee = withdrawalFee;
        if (withdrawalFeePercentage !== undefined) settings.fees.withdrawalFeePercentage = withdrawalFeePercentage;
        if (inactivityFee !== undefined) settings.fees.inactivityFee = inactivityFee;
        if (inactivityDays !== undefined) settings.fees.inactivityDays = inactivityDays;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Fees updated successfully',
            data: settings.fees
        });
    } catch (error) {
        console.error('Update fees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update fees'
        });
    }
});

// ==================== SYSTEM SETTINGS ====================

// GET SYSTEM SETTINGS
router.get('/system-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.systemSettings
        });
    } catch (error) {
        console.error('Get system settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch system settings'
        });
    }
});

// UPDATE SYSTEM SETTINGS
router.put('/system-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { maintenanceMode, registrationEnabled, kycRequired, minWithdrawal, maxWithdrawal, minDeposit, maxDeposit } = req.body;

        if (maintenanceMode !== undefined) settings.systemSettings.maintenanceMode = maintenanceMode;
        if (registrationEnabled !== undefined) settings.systemSettings.registrationEnabled = registrationEnabled;
        if (kycRequired !== undefined) settings.systemSettings.kycRequired = kycRequired;
        if (minWithdrawal !== undefined) settings.systemSettings.minWithdrawal = minWithdrawal;
        if (maxWithdrawal !== undefined) settings.systemSettings.maxWithdrawal = maxWithdrawal;
        if (minDeposit !== undefined) settings.systemSettings.minDeposit = minDeposit;
        if (maxDeposit !== undefined) settings.systemSettings.maxDeposit = maxDeposit;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'System settings updated successfully',
            data: settings.systemSettings
        });
    } catch (error) {
        console.error('Update system settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update system settings'
        });
    }
});

// ==================== REFERRAL SETTINGS ====================

// GET REFERRAL SETTINGS
router.get('/referral-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.referralSettings
        });
    } catch (error) {
        console.error('Get referral settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch referral settings'
        });
    }
});

// UPDATE REFERRAL SETTINGS
router.put('/referral-settings', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { commissionPercentage, minPayoutAmount, payoutMethod } = req.body;


        if (commissionPercentage !== undefined) settings.referralSettings.commissionPercentage = commissionPercentage;
        if (minPayoutAmount !== undefined) settings.referralSettings.minPayoutAmount = minPayoutAmount;
        if (payoutMethod !== undefined) settings.referralSettings.payoutMethod = payoutMethod;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Referral settings updated successfully',
            data: settings.referralSettings
        });
    } catch (error) {
        console.error('Update referral settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update referral settings'
        });
    }
});

export default router;
