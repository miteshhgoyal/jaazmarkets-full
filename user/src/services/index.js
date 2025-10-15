import { mockData } from '../data';
import api from './api';

// const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
const USE_MOCK = false;

// Mock delay utility
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API wrapper
class ApiService {
    constructor(endpoint, mockDataKey) {
        this.endpoint = endpoint;
        this.mockDataKey = mockDataKey;
    }

    async get(params = {}) {
        if (USE_MOCK) {
            await mockDelay();
            const data = this.getMockData(params);
            return { data, success: true };
        }

        try {
            const response = await api.get(this.endpoint, { params });
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }

    async post(data, path = '') {
        const fullPath = path ? `${this.endpoint}${path}` : this.endpoint;

        if (USE_MOCK) {
            await mockDelay(800);
            return this.handleMockCreate(data);
        }

        try {
            const response = await api.post(fullPath, data);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }

    async put(id, data) {
        if (USE_MOCK) {
            await mockDelay(600);
            return { data: { id, ...data }, success: true };
        }

        try {
            const response = await api.put(`${this.endpoint}/${id}`, data);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }

    getMockData(params) {
        const data = mockData[this.mockDataKey];
        if (params.type && data[params.type]) {
            return data[params.type];
        }
        return data;
    }

    handleMockCreate(data) {
        const newItem = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString(),
        };
        return { data: newItem, success: true };
    }
}

// Withdrawals API Service
class WithdrawalsApiService extends ApiService {
    constructor() {
        super('/withdrawals', 'withdrawals');
    }

    // Override handleMockCreate for withdrawal-specific logic
    handleMockCreate(data) {
        if (data && typeof data === 'object' && data.amount) {
            // Mock different withdrawal scenarios
            const scenario = Math.random();

            // 10% failure rate for testing
            if (scenario < 0.1) {
                return {
                    data: null,
                    success: false,
                    error: "Withdrawal failed due to bank connectivity issues",
                    errorCode: "BANK_ERROR_001"
                };
            }

            // Generate transaction ID
            const transactionId = `WD${Date.now()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

            return {
                data: {
                    transactionId,
                    status: 'pending',
                    estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    ...data
                },
                success: true
            };
        }

        // Default behavior for other data
        return super.handleMockCreate(data);
    }

    // Validate withdrawal
    async validate(withdrawalData) {
        if (USE_MOCK) {
            await mockDelay(300);

            // Mock validation scenarios
            const errors = {};
            if (withdrawalData.amount > 10000) {
                errors.amount = "Daily withdrawal limit exceeded";
            }
            if (withdrawalData.amount < 10) {
                errors.amount = "Minimum withdrawal amount is 10";
            }
            if (withdrawalData.accountId === "insufficient") {
                errors.account = "Insufficient balance";
            }

            return {
                data: { valid: Object.keys(errors).length === 0 },
                success: Object.keys(errors).length === 0,
                errors: Object.keys(errors).length > 0 ? errors : undefined,
                error: Object.keys(errors).length > 0 ? "Validation failed" : undefined
            };
        }

        try {
            const response = await api.post(`${this.endpoint}/validate`, withdrawalData);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message,
                errors: error.response?.data?.errors
            };
        }
    }

    // Get withdrawal status
    async getStatus(transactionId) {
        if (USE_MOCK) {
            await mockDelay();
            return {
                data: {
                    transactionId,
                    status: 'processing',
                    progress: 'Sent to bank for processing',
                    estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                },
                success: true
            };
        }

        try {
            const response = await api.get(`${this.endpoint}/status/${transactionId}`);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }

    // Cancel withdrawal
    async cancel(transactionId) {
        if (USE_MOCK) {
            await mockDelay(500);

            // Mock 20% chance that withdrawal can't be cancelled (already processed)
            if (Math.random() < 0.2) {
                return {
                    data: null,
                    success: false,
                    error: "Withdrawal cannot be cancelled as it's already being processed"
                };
            }

            return {
                data: {
                    transactionId,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString()
                },
                success: true
            };
        }

        try {
            const response = await api.put(`${this.endpoint}/${transactionId}/cancel`);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Crypto Wallets API Service
class CryptoWalletsApiService extends ApiService {
    constructor() {
        super('/crypto-wallets', 'cryptoWallets');
    }

    getMockData(params) {
        const data = mockData[this.mockDataKey];

        if (params.type) {
            switch (params.type) {
                case 'accounts':
                    const accounts = data.accounts || [];
                    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
                    return { accounts, totalBalance };
                case 'external-wallets':
                    return { externalWallets: data.externalWallets || [] };
                default:
                    return data;
            }
        }
        return data;
    }

    async delete(path) {
        if (USE_MOCK) {
            await mockDelay(400);
            return { data: { deleted: true, id: path.split('/').pop() }, success: true };
        }

        try {
            const response = await api.delete(`${this.endpoint}${path}`);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }
}

class TransactionHistoryApiService extends ApiService {
    constructor() {
        super('transaction-history', 'transactionHistory');
    }

    // Override getMockData for transaction filtering
    getMockData(params) {
        const data = mockData[this.mockDataKey] || [];

        if (params?.type && params.type !== 'all') {
            return data.filter(transaction => transaction.type === params.type);
        }

        return data;
    }
}

class TransfersApiService extends ApiService {
    constructor() {
        super('/transfers', 'transfers');
    }

    // Override getMockData to return the complete transfers object structure
    getMockData(params) {
        const transfersData = mockData[this.mockDataKey] || {};

        // Return the complete transfers object with all sub-objects
        return {
            transferOptions: transfersData.transferOptions || [],
            transferReasons: transfersData.transferReasons || [],
            accounts: transfersData.accounts || [],
            ...transfersData
        };
    }

    // Override handleMockCreate for transfer-specific logic
    handleMockCreate(data) {
        if (data && typeof data === 'object' && data.amount) {
            // Mock different transfer scenarios
            const scenario = Math.random();

            // 8% failure rate for testing
            if (scenario < 0.08) {
                const errorMessages = [
                    "Transfer failed due to insufficient balance",
                    "Recipient account not found or invalid",
                    "Email address does not match account records",
                    "Daily transfer limit exceeded",
                    "Transfer temporarily unavailable"
                ];

                return {
                    data: null,
                    success: false,
                    error: errorMessages[Math.floor(Math.random() * errorMessages.length)],
                    errorCode: `TRANSFER_ERROR_${Math.floor(Math.random() * 999) + 1}`
                };
            }

            // Generate transaction ID based on transfer type
            const prefix = data.methodType === 'internal' ? 'INT' : 'EXT';
            const transactionId = `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

            // Determine processing time based on method
            let estimatedArrival;
            if (data.methodId === 'betweenaccounts') {
                estimatedArrival = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
            } else if (data.methodId === 'toanotheruser') {
                estimatedArrival = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day
            }

            return {
                data: {
                    transactionId,
                    status: data.methodType === 'internal' ? 'completed' : 'pending',
                    estimatedArrival,
                    ...data,
                    createdAt: new Date().toISOString(),
                    ...(data.methodType === 'internal' && {
                        completedAt: new Date().toISOString()
                    })
                },
                success: true
            };
        }

        // Default behavior for other data
        return super.handleMockCreate(data);
    }

    // Validate transfer with enhanced logic for both transfer types
    async validate(transferData) {
        if (USE_MOCK) {
            await mockDelay(400);

            const errors = {};
            const { amount, methodId, fromAccountId, toAccountId, recipientAccountNumber, recipientEmail } = transferData;

            // Common validations
            if (amount > 10000) {
                errors.amount = "Daily transfer limit exceeded (10,000 USD)";
            }
            if (amount < 15) {
                errors.amount = "Minimum transfer amount is 15 USD";
            }

            // Between accounts validation
            if (methodId === 'betweenaccounts') {
                if (!fromAccountId || !toAccountId) {
                    errors.accounts = "Both source and destination accounts are required";
                }
                if (fromAccountId === toAccountId) {
                    errors.accounts = "Cannot transfer to the same account";
                }

                // Mock insufficient balance check
                const mockAccounts = mockData.transfers?.accounts || [];
                const fromAccount = mockAccounts.find(acc => acc.id === fromAccountId);
                if (fromAccount && amount > fromAccount.balance) {
                    errors.amount = `Insufficient balance. Available: ${fromAccount.balance} USD`;
                }
            }

            // To another user validation
            if (methodId === 'toanotheruser') {
                if (!recipientAccountNumber) {
                    errors.recipientAccount = "Recipient account number is required";
                }
                if (!recipientEmail) {
                    errors.recipientEmail = "Recipient email address is required";
                }

                // Mock email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (recipientEmail && !emailRegex.test(recipientEmail)) {
                    errors.recipientEmail = "Invalid email format";
                }

                // Mock account verification (simulate 10% mismatch)
                if (recipientAccountNumber && recipientEmail && Math.random() < 0.1) {
                    errors.verification = "Account number and email do not match our records";
                }
            }

            return {
                data: { valid: Object.keys(errors).length === 0 },
                success: Object.keys(errors).length === 0,
                errors: Object.keys(errors).length > 0 ? errors : undefined,
                error: Object.keys(errors).length > 0 ? "Validation failed" : undefined
            };
        }

        try {
            const response = await api.post(`${this.endpoint}/validate`, transferData);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message,
                errors: error.response?.data?.errors
            };
        }
    }

    // Get transfer status
    async getStatus(transactionId) {
        if (USE_MOCK) {
            await mockDelay(300);

            // Mock different status scenarios based on transaction type
            const isInternal = transactionId.startsWith('INT');
            const isExternal = transactionId.startsWith('EXT');

            if (isInternal) {
                return {
                    data: {
                        transactionId,
                        status: 'completed',
                        progress: 'Transfer completed instantly',
                        completedAt: new Date().toISOString()
                    },
                    success: true
                };
            } else if (isExternal) {
                const statuses = ['pending', 'processing', 'completed'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                return {
                    data: {
                        transactionId,
                        status: randomStatus,
                        progress: randomStatus === 'pending' ? 'Validating recipient details' :
                            randomStatus === 'processing' ? 'Transfer in progress' :
                                'Transfer completed',
                        estimatedCompletion: randomStatus !== 'completed' ?
                            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
                        ...(randomStatus === 'completed' && {
                            completedAt: new Date().toISOString()
                        })
                    },
                    success: true
                };
            }

            // Default status
            return {
                data: {
                    transactionId,
                    status: 'pending',
                    progress: 'Transfer initiated'
                },
                success: true
            };
        }

        try {
            const response = await api.get(`${this.endpoint}/status/${transactionId}`);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }

    // Cancel transfer
    async cancel(transactionId) {
        if (USE_MOCK) {
            await mockDelay(500);

            // Internal transfers can't be cancelled (instant)
            if (transactionId.startsWith('INT')) {
                return {
                    data: null,
                    success: false,
                    error: "Internal transfers cannot be cancelled as they are processed instantly"
                };
            }

            // Mock 15% chance that external transfer can't be cancelled (already processed)
            if (Math.random() < 0.15) {
                return {
                    data: null,
                    success: false,
                    error: "Transfer cannot be cancelled as it's already being processed"
                };
            }

            return {
                data: {
                    transactionId,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    refundAmount: 'Original amount will be refunded within 24 hours'
                },
                success: true
            };
        }

        try {
            const response = await api.put(`${this.endpoint}/${transactionId}/cancel`);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Additional method to verify recipient for "to another user" transfers
    async verifyRecipient(recipientData) {
        if (USE_MOCK) {
            await mockDelay(600);

            const { recipientAccountNumber, recipientEmail } = recipientData;

            // Mock verification success rate (90%)
            if (Math.random() < 0.9) {
                return {
                    data: {
                        verified: true,
                        recipientName: "John Doe", // Mock recipient name
                        message: "Recipient verified successfully"
                    },
                    success: true
                };
            } else {
                return {
                    data: {
                        verified: false,
                        message: "Account number and email do not match our records"
                    },
                    success: false,
                    error: "Recipient verification failed"
                };
            }
        }

        try {
            const response = await api.post(`${this.endpoint}/verify-recipient`, recipientData);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Profile API Service
class ProfileApiService extends ApiService {
    constructor() {
        super('/profile', 'profile');
    }

    // Get profile with verification steps
    getMockData(params) {
        const data = mockData[this.mockDataKey] || {};

        return {
            ...data,
            status: {
                heading: "Status",
                value: data.isVerified ? "Verified" : "Pending",
                subheading: `${data.completedSteps || 0}/3 steps complete`,
            },
            depositLimit: {
                heading: "Deposit Limit",
                value: `${data.depositLimit || 150000} USD`,
                subheading: "Remaining from the initial limit",
            },
            verificationSteps: data.verificationSteps || [],
            personalInfo: data.personalInfo || {},
        };
    }

    // Update verification step
    async updateVerificationStep(stepId, stepData) {
        if (USE_MOCK) {
            await mockDelay(600);
            return {
                data: {
                    stepId,
                    status: 'verified',
                    updatedAt: new Date().toISOString(),
                    ...stepData
                },
                success: true
            };
        }

        try {
            const response = await api.put(`${this.endpoint}/verification/${stepId}`, stepData);
            return { data: response.data, success: true };
        } catch (error) {
            return { data: null, success: false, error: error.message };
        }
    }
}

// Security API Service
class SecurityApiService extends ApiService {
    constructor() {
        super('/security', 'security');
    }

    getMockData(params) {
        const data = mockData[this.mockDataKey] || {};

        return {
            login: data.login || {},
            password: data.password || {},
            verificationMethod: data.verificationMethod || {},
            verificationOptions: data.verificationOptions || []
        };
    }

    // Change password
    async changePassword(passwordData) {
        if (USE_MOCK) {
            await mockDelay(800);

            // Mock validation
            if (passwordData.newPassword !== passwordData.repeatPassword) {
                return {
                    data: null,
                    success: false,
                    error: "Passwords do not match"
                };
            }

            return {
                data: {
                    message: "Password changed successfully",
                    changedAt: new Date().toISOString()
                },
                success: true
            };
        }

        try {
            const response = await api.post(`${this.endpoint}/change-password`, passwordData);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Change phone
    async changePhone(phoneData) {
        if (USE_MOCK) {
            await mockDelay(600);

            return {
                data: {
                    message: "Phone number changed successfully",
                    newPhone: phoneData.newPhone,
                    changedAt: new Date().toISOString()
                },
                success: true
            };
        }

        try {
            const response = await api.post(`${this.endpoint}/change-phone`, phoneData);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Logout from all devices
    async logoutAllDevices() {
        if (USE_MOCK) {
            await mockDelay(500);

            return {
                data: {
                    message: "Successfully logged out from all other devices",
                    logoutCount: Math.floor(Math.random() * 5) + 1
                },
                success: true
            };
        }

        try {
            const response = await api.post(`${this.endpoint}/logout-all-devices`);
            return { data: response.data, success: true };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Trading Terminals API Service
class TradingTerminalsApiService extends ApiService {
    constructor() {
        super('/trading-terminals', 'tradingTerminals');
    }

    getMockData(params) {
        const data = mockData[this.mockDataKey] || {};

        return {
            mt5: data.mt5 || {},
            mt4: data.mt4 || {}
        };
    }

    // Update terminal preference
    async updateTerminalPreference(terminalType, terminalData) {
        if (USE_MOCK) {
            await mockDelay(600);

            return {
                data: {
                    terminalType,
                    selectedTerminal: terminalData.selectedTerminal,
                    updatedAt: new Date().toISOString()
                },
                message: `${terminalType} preference updated successfully`,
                success: true
            };
        }

        try {
            const response = await api.put(`${this.endpoint}/${terminalType}`, terminalData);
            return {
                data: response.data.data || response.data,
                message: response.data.message || 'Preference updated successfully',
                success: true
            };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Export specific services
export const accountsApi = new ApiService('/accounts', 'accounts');
export const depositsApi = new ApiService('/deposits', 'deposits');
export const withdrawalsApi = new WithdrawalsApiService();
export const cryptoWalletsApi = new CryptoWalletsApiService();
export const transactionHistoryApi = new TransactionHistoryApiService();
export const transfersApi = new TransfersApiService();
export const profileApi = new ProfileApiService();
export const securityApi = new SecurityApiService();
export const tradingTerminalsApi = new TradingTerminalsApiService();

/*
WITHDRAWAL API USAGE GUIDE:

Basic operations (inherited from ApiService):
withdrawalsApi.get()                           // Get all withdrawal options/data
withdrawalsApi.post('', withdrawalData)        // Create withdrawal
withdrawalsApi.put(id, data)                   // Update withdrawal

Enhanced withdrawal-specific operations:
withdrawalsApi.validate(withdrawalData)        // Validate before creating
withdrawalsApi.getStatus(transactionId)        // Check withdrawal status  
withdrawalsApi.cancel(transactionId)           // Cancel pending withdrawal

Example usage in hooks:
const result = await withdrawalsApi.validate({ amount: 1000, accountId: 'acc1' });
const withdrawal = await withdrawalsApi.post('', { amount: 500, methodId: 'bank' });
const status = await withdrawalsApi.getStatus('WD12345');
const cancelled = await withdrawalsApi.cancel('WD12345');
*/
