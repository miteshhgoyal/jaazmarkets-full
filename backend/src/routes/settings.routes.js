// routes/admin/settings.routes.js
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
            withdrawalMethods: []
        });
        await settings.save();
    }
    return settings;
};

// ==================== ACCOUNT TYPES CRUD ====================

// GET ALL ACCOUNT TYPES
router.get('/account-types', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        const accountTypes = settings.accountTypes.map(at => ({
            id: at.id,
            name: at.name,
            category: at.category,
            description: at.description,
            image: at.image,
            minDeposit: at.minDeposit,
            minSpread: at.minSpread,
            maxLeverage: at.maxLeverage,
            commission: at.commission,
            features: at.features,
            isActive: at.isActive
        }));

        res.json({
            success: true,
            data: accountTypes,
            total: accountTypes.length
        });
    } catch (error) {
        console.error('Get account types error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch account types'
        });
    }
});

// GET SINGLE ACCOUNT TYPE BY ID
router.get('/account-types/:accountTypeId', async (req, res) => {
    try {
        const { accountTypeId } = req.params;
        const settings = await getOrCreateSettings();

        const accountType = settings.accountTypes.find(at => at.id === accountTypeId);

        if (!accountType) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: accountType.id,
                name: accountType.name,
                category: accountType.category,
                description: accountType.description,
                image: accountType.image,
                minDeposit: accountType.minDeposit,
                minSpread: accountType.minSpread,
                maxLeverage: accountType.maxLeverage,
                commission: accountType.commission,
                features: accountType.features,
                isActive: accountType.isActive
            }
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

        // Validation
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name and category are required'
            });
        }

        const settings = await getOrCreateSettings();

        // Check if account type with same name already exists
        const existingAccountType = settings.accountTypes.find(at =>
            at.name.toLowerCase() === name.toLowerCase()
        );

        if (existingAccountType) {
            return res.status(400).json({
                success: false,
                message: 'Account type with this name already exists'
            });
        }

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

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create account type'
        });
    }
});

// UPDATE ACCOUNT TYPE
router.put('/account-types/:accountTypeId', async (req, res) => {
    try {
        const { accountTypeId } = req.params;
        const { name, category, description, image, minDeposit, minSpread, maxLeverage, commission, features, isActive } = req.body;

        const settings = await getOrCreateSettings();

        const accountTypeIndex = settings.accountTypes.findIndex(at => at.id === accountTypeId);

        if (accountTypeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        // Check if new name conflicts with existing account types (excluding current one)
        if (name) {
            const nameConflict = settings.accountTypes.find((at, index) =>
                index !== accountTypeIndex && at.name.toLowerCase() === name.toLowerCase()
            );

            if (nameConflict) {
                return res.status(400).json({
                    success: false,
                    message: 'Account type with this name already exists'
                });
            }
        }

        // Update account type
        if (name !== undefined) settings.accountTypes[accountTypeIndex].name = name;
        if (category !== undefined) settings.accountTypes[accountTypeIndex].category = category;
        if (description !== undefined) settings.accountTypes[accountTypeIndex].description = description;
        if (image !== undefined) settings.accountTypes[accountTypeIndex].image = image;
        if (minDeposit !== undefined) settings.accountTypes[accountTypeIndex].minDeposit = minDeposit;
        if (minSpread !== undefined) settings.accountTypes[accountTypeIndex].minSpread = minSpread;
        if (maxLeverage !== undefined) settings.accountTypes[accountTypeIndex].maxLeverage = maxLeverage;
        if (commission !== undefined) settings.accountTypes[accountTypeIndex].commission = commission;
        if (features !== undefined) settings.accountTypes[accountTypeIndex].features = features;
        if (isActive !== undefined) settings.accountTypes[accountTypeIndex].isActive = isActive;

        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: 'Account type updated successfully',
            data: settings.accountTypes[accountTypeIndex]
        });
    } catch (error) {
        console.error('Update account type error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update account type'
        });
    }
});

// DELETE ACCOUNT TYPE
router.delete('/account-types/:accountTypeId', async (req, res) => {
    try {
        const { accountTypeId } = req.params;

        const settings = await getOrCreateSettings();

        const accountTypeIndex = settings.accountTypes.findIndex(at => at.id === accountTypeId);

        if (accountTypeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        // Remove account type
        settings.accountTypes.splice(accountTypeIndex, 1);
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

// TOGGLE ACCOUNT TYPE STATUS
router.patch('/account-types/:accountTypeId/toggle-status', async (req, res) => {
    try {
        const { accountTypeId } = req.params;
        const { isActive } = req.body;

        const settings = await getOrCreateSettings();

        const accountTypeIndex = settings.accountTypes.findIndex(at => at.id === accountTypeId);

        if (accountTypeIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Account type not found'
            });
        }

        settings.accountTypes[accountTypeIndex].isActive = isActive;
        settings.updatedBy = req.user.userId;
        await settings.save();

        res.json({
            success: true,
            message: `Account type ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: accountTypeId,
                isActive
            }
        });
    } catch (error) {
        console.error('Toggle account type status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle account type status'
        });
    }
});

export default router;
