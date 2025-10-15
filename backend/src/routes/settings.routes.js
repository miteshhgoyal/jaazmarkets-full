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
            depositMethods: [],
            withdrawalMethods: [],
            paymentMethods: {
                crypto: {
                    enabled: true,
                    cryptocurrencies: []
                },
                bankTransfer: {
                    enabled: true,
                    minDeposit: 10,
                    minWithdrawal: 10,
                    processingTime: '1-3 business days'
                }
            },
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
                maxWithdrawal: 50000
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

// ==================== DEPOSIT METHODS CRUD ====================

// GET ALL DEPOSIT METHODS
router.get('/deposit-methods', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.depositMethods,
            total: settings.depositMethods.length
        });
    } catch (error) {
        console.error('Get deposit methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deposit methods'
        });
    }
});

// CREATE DEPOSIT METHOD
router.post('/deposit-methods', async (req, res) => {
    try {
        const { name, type, currencyType, network, walletAddress, minDeposit, maxDeposit, fee, feePercentage, processingTime, image, description, isActive, recommended, bankDetails } = req.body;

        if (!name || !type || !minDeposit) {
            return res.status(400).json({
                success: false,
                message: 'Name, type, and minDeposit are required'
            });
        }

        const settings = await getOrCreateSettings();

        const newMethod = {
            id: uuidv4(),
            name,
            type,
            currencyType: currencyType || '',
            network: network || '',
            walletAddress: walletAddress || '',
            minDeposit,
            maxDeposit: maxDeposit || null,
            fee: fee || 0,
            feePercentage: feePercentage || 0,
            processingTime: processingTime || '',
            image: image || '',
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
            recommended: recommended || false,
            bankDetails: bankDetails || {}
        };

        settings.depositMethods.push(newMethod);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Deposit method created successfully',
            data: newMethod
        });
    } catch (error) {
        console.error('Create deposit method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create deposit method'
        });
    }
});

// UPDATE DEPOSIT METHOD
router.put('/deposit-methods/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.depositMethods.findIndex(m => m.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Deposit method not found'
            });
        }

        const { name, type, currencyType, network, walletAddress, minDeposit, maxDeposit, fee, feePercentage, processingTime, image, description, isActive, recommended, bankDetails } = req.body;

        if (name !== undefined) settings.depositMethods[index].name = name;
        if (type !== undefined) settings.depositMethods[index].type = type;
        if (currencyType !== undefined) settings.depositMethods[index].currencyType = currencyType;
        if (network !== undefined) settings.depositMethods[index].network = network;
        if (walletAddress !== undefined) settings.depositMethods[index].walletAddress = walletAddress;
        if (minDeposit !== undefined) settings.depositMethods[index].minDeposit = minDeposit;
        if (maxDeposit !== undefined) settings.depositMethods[index].maxDeposit = maxDeposit;
        if (fee !== undefined) settings.depositMethods[index].fee = fee;
        if (feePercentage !== undefined) settings.depositMethods[index].feePercentage = feePercentage;
        if (processingTime !== undefined) settings.depositMethods[index].processingTime = processingTime;
        if (image !== undefined) settings.depositMethods[index].image = image;
        if (description !== undefined) settings.depositMethods[index].description = description;
        if (isActive !== undefined) settings.depositMethods[index].isActive = isActive;
        if (recommended !== undefined) settings.depositMethods[index].recommended = recommended;
        if (bankDetails !== undefined) settings.depositMethods[index].bankDetails = bankDetails;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Deposit method updated successfully',
            data: settings.depositMethods[index]
        });
    } catch (error) {
        console.error('Update deposit method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update deposit method'
        });
    }
});

// DELETE DEPOSIT METHOD
router.delete('/deposit-methods/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.depositMethods.findIndex(m => m.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Deposit method not found'
            });
        }

        settings.depositMethods.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Deposit method deleted successfully'
        });
    } catch (error) {
        console.error('Delete deposit method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete deposit method'
        });
    }
});

// ==================== WITHDRAWAL METHODS CRUD ====================

// GET ALL WITHDRAWAL METHODS
router.get('/withdrawal-methods', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.withdrawalMethods,
            total: settings.withdrawalMethods.length
        });
    } catch (error) {
        console.error('Get withdrawal methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch withdrawal methods'
        });
    }
});

// CREATE WITHDRAWAL METHOD
router.post('/withdrawal-methods', async (req, res) => {
    try {
        const { name, type, currencyType, network, minWithdrawal, maxWithdrawal, fee, feePercentage, processingTime, image, description, limits, isActive, recommended } = req.body;

        if (!name || !type || !minWithdrawal) {
            return res.status(400).json({
                success: false,
                message: 'Name, type, and minWithdrawal are required'
            });
        }

        const settings = await getOrCreateSettings();

        const newMethod = {
            id: uuidv4(),
            name,
            type,
            currencyType: currencyType || '',
            network: network || '',
            minWithdrawal,
            maxWithdrawal: maxWithdrawal || null,
            fee: fee || 0,
            feePercentage: feePercentage || 0,
            processingTime: processingTime || '',
            image: image || '',
            description: description || '',
            limits: limits || '',
            isActive: isActive !== undefined ? isActive : true,
            recommended: recommended || false
        };

        settings.withdrawalMethods.push(newMethod);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal method created successfully',
            data: newMethod
        });
    } catch (error) {
        console.error('Create withdrawal method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create withdrawal method'
        });
    }
});

// UPDATE WITHDRAWAL METHOD
router.put('/withdrawal-methods/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.withdrawalMethods.findIndex(m => m.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal method not found'
            });
        }

        const { name, type, currencyType, network, minWithdrawal, maxWithdrawal, fee, feePercentage, processingTime, image, description, limits, isActive, recommended } = req.body;

        if (name !== undefined) settings.withdrawalMethods[index].name = name;
        if (type !== undefined) settings.withdrawalMethods[index].type = type;
        if (currencyType !== undefined) settings.withdrawalMethods[index].currencyType = currencyType;
        if (network !== undefined) settings.withdrawalMethods[index].network = network;
        if (minWithdrawal !== undefined) settings.withdrawalMethods[index].minWithdrawal = minWithdrawal;
        if (maxWithdrawal !== undefined) settings.withdrawalMethods[index].maxWithdrawal = maxWithdrawal;
        if (fee !== undefined) settings.withdrawalMethods[index].fee = fee;
        if (feePercentage !== undefined) settings.withdrawalMethods[index].feePercentage = feePercentage;
        if (processingTime !== undefined) settings.withdrawalMethods[index].processingTime = processingTime;
        if (image !== undefined) settings.withdrawalMethods[index].image = image;
        if (description !== undefined) settings.withdrawalMethods[index].description = description;
        if (limits !== undefined) settings.withdrawalMethods[index].limits = limits;
        if (isActive !== undefined) settings.withdrawalMethods[index].isActive = isActive;
        if (recommended !== undefined) settings.withdrawalMethods[index].recommended = recommended;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Withdrawal method updated successfully',
            data: settings.withdrawalMethods[index]
        });
    } catch (error) {
        console.error('Update withdrawal method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update withdrawal method'
        });
    }
});

// DELETE WITHDRAWAL METHOD
router.delete('/withdrawal-methods/:id', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const index = settings.withdrawalMethods.findIndex(m => m.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Withdrawal method not found'
            });
        }

        settings.withdrawalMethods.splice(index, 1);
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Withdrawal method deleted successfully'
        });
    } catch (error) {
        console.error('Delete withdrawal method error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete withdrawal method'
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
        const { maintenanceMode, registrationEnabled, kycRequired, minWithdrawal, maxWithdrawal } = req.body;

        if (maintenanceMode !== undefined) settings.systemSettings.maintenanceMode = maintenanceMode;
        if (registrationEnabled !== undefined) settings.systemSettings.registrationEnabled = registrationEnabled;
        if (kycRequired !== undefined) settings.systemSettings.kycRequired = kycRequired;
        if (minWithdrawal !== undefined) settings.systemSettings.minWithdrawal = minWithdrawal;
        if (maxWithdrawal !== undefined) settings.systemSettings.maxWithdrawal = maxWithdrawal;

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

// ==================== PAYMENT METHODS (CRYPTO & BANK) ====================

// GET PAYMENT METHODS
router.get('/payment-methods', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json({
            success: true,
            data: settings.paymentMethods
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment methods'
        });
    }
});

// UPDATE CRYPTO PAYMENT SETTINGS
router.put('/payment-methods/crypto', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { enabled, cryptocurrencies } = req.body;

        if (enabled !== undefined) settings.paymentMethods.crypto.enabled = enabled;
        if (cryptocurrencies !== undefined) settings.paymentMethods.crypto.cryptocurrencies = cryptocurrencies;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Crypto payment settings updated successfully',
            data: settings.paymentMethods.crypto
        });
    } catch (error) {
        console.error('Update crypto payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update crypto payment settings'
        });
    }
});

// UPDATE BANK TRANSFER SETTINGS
router.put('/payment-methods/bank-transfer', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const { enabled, minDeposit, minWithdrawal, processingTime } = req.body;

        if (enabled !== undefined) settings.paymentMethods.bankTransfer.enabled = enabled;
        if (minDeposit !== undefined) settings.paymentMethods.bankTransfer.minDeposit = minDeposit;
        if (minWithdrawal !== undefined) settings.paymentMethods.bankTransfer.minWithdrawal = minWithdrawal;
        if (processingTime !== undefined) settings.paymentMethods.bankTransfer.processingTime = processingTime;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Bank transfer settings updated successfully',
            data: settings.paymentMethods.bankTransfer
        });
    } catch (error) {
        console.error('Update bank transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update bank transfer settings'
        });
    }
});

export default router;
