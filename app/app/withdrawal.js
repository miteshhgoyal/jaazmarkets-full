import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import api from '@/services/api'

const Withdrawal = () => {
    const router = useRouter()
    const params = useLocalSearchParams()

    // Data
    const [withdrawalMethods, setWithdrawalMethods] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Form
    const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState(null)
    const [selectedCurrency, setSelectedCurrency] = useState('USDT')
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [amountError, setAmountError] = useState('')
    const [showWithdrawalDetails, setShowWithdrawalDetails] = useState(false)

    // Crypto
    const [cryptoWalletAddress, setCryptoWalletAddress] = useState('')
    const [walletAddressError, setWalletAddressError] = useState('')
    const [selectedNetwork, setSelectedNetwork] = useState('')

    // API
    const [isProcessing, setIsProcessing] = useState(false)
    const [withdrawalStatus, setWithdrawalStatus] = useState(null)
    const [withdrawalResult, setWithdrawalResult] = useState(null)

    // Status Polling
    const [pollingWithdrawalId, setPollingWithdrawalId] = useState(null)
    const [polledStatus, setPolledStatus] = useState(null)
    const [polledTxHash, setPolledTxHash] = useState(null)
    const [polledBlockBeeStatus, setPolledBlockBeeStatus] = useState(null)
    const [isPolling, setIsPolling] = useState(false)

    // UI
    const [showAccountPicker, setShowAccountPicker] = useState(false)
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    useEffect(() => {
        fetchWithdrawalData()

        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        )
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    // Poll withdrawal status every 15 seconds
    useEffect(() => {
        if (!pollingWithdrawalId || polledStatus === 'completed' || polledStatus === 'failed') {
            setIsPolling(false)
            return
        }

        setIsPolling(true)

        const checkWithdrawalStatus = async () => {
            try {
                const response = await api.get(`/transactions/withdrawals/${pollingWithdrawalId}/check-status`)

                if (response.data.success) {
                    setPolledStatus(response.data.data.status)
                    setPolledBlockBeeStatus(response.data.data.blockBeeStatus)
                    setPolledTxHash(response.data.data.txHash)

                    if (response.data.data.status === 'completed') {
                        setIsPolling(false)
                        Alert.alert('Success', 'Withdrawal completed! ✅')
                    } else if (response.data.data.status === 'failed') {
                        setIsPolling(false)
                        Alert.alert('Failed', 'Withdrawal failed and refunded ❌')
                    }
                }
            } catch (error) {
                console.error('Status check error:', error)
            }
        }

        checkWithdrawalStatus()
        const interval = setInterval(checkWithdrawalStatus, 15000)

        return () => clearInterval(interval)
    }, [pollingWithdrawalId, polledStatus])

    // Handle query params for method redirect
    useEffect(() => {
        if (withdrawalMethods.length === 0 || accounts.length === 0) return

        const methodParam = params.method
        const currencyParam = params.pp_currency
        const accountParam = params.pp_account

        // Auto-select method
        if (methodParam || currencyParam) {
            let targetMethod = null

            if (currencyParam) {
                targetMethod = withdrawalMethods.find(
                    (option) =>
                        option.currencyType === currencyParam ||
                        option.id === currencyParam ||
                        option.id.includes(currencyParam.toLowerCase())
                )
            }

            if (!targetMethod && methodParam) {
                targetMethod = withdrawalMethods.find((option) => option.id === methodParam)
            }

            if (targetMethod) {
                handleMethodSelection(targetMethod)
            }
        }

        // Auto-select account
        if (accountParam) {
            const account = accounts.find((acc) => acc._id === accountParam)
            if (account) {
                setSelectedAccount(account)
            }
        }
    }, [params, withdrawalMethods, accounts])

    const fetchWithdrawalData = async () => {
        setLoading(true)
        try {
            const methodsResponse = await api.get('/transactions/withdrawal-methods')
            const accountsResponse = await api.get('/account/my-accounts')

            if (methodsResponse.data.success) {
                setWithdrawalMethods(methodsResponse.data.data)
            }

            if (accountsResponse.data.success) {
                const realAccounts = accountsResponse.data.data.filter(acc => acc.accountType === 'Real')
                setAccounts(realAccounts)
            }

            setError(null)
        } catch (err) {
            console.error('Error fetching withdrawal data:', err)
            setError(err.response?.data?.message || 'Failed to load withdrawal methods')
            Alert.alert('Error', 'Failed to load withdrawal methods')
        } finally {
            setLoading(false)
        }
    }

    const isCryptoMethod = () => {
        return selectedWithdrawalMethod?.type === 'crypto'
    }

    const getCurrencyForMethod = (method) => {
        return method?.currencyType || 'USDT'
    }

    const handleMethodSelection = (method) => {
        setSelectedWithdrawalMethod(method)
        const methodCurrency = getCurrencyForMethod(method)
        setSelectedCurrency(methodCurrency)
        setSelectedNetwork(method?.network || '')
        setSelectedAccount(null)
        setWithdrawalAmount('')
        setCryptoWalletAddress('')
        setAmountError('')
        setWalletAddressError('')
        setShowWithdrawalDetails(false)
        setWithdrawalStatus(null)
        setWithdrawalResult(null)
    }

    const resetSelection = () => {
        setSelectedWithdrawalMethod(null)
        setSelectedCurrency('USDT')
        setSelectedAccount(null)
        setWithdrawalAmount('')
        setCryptoWalletAddress('')
        setSelectedNetwork('')
        setAmountError('')
        setWalletAddressError('')
        setShowWithdrawalDetails(false)
        setWithdrawalStatus(null)
        setWithdrawalResult(null)
        setPollingWithdrawalId(null)
        setPolledStatus(null)
        setPolledTxHash(null)
        setPolledBlockBeeStatus(null)
        setIsPolling(false)
    }

    const validateWalletAddress = (address, currency) => {
        if (!address || !address.trim()) {
            return 'Wallet address is required'
        }

        const validationPatterns = {
            BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
            ETH: /^0x[a-fA-F0-9]{40}$/,
            USDT: /^0x[a-fA-F0-9]{40}$|^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^T[A-Za-z1-9]{33}$/,
            USDC: /^0x[a-fA-F0-9]{40}$/,
            TRX: /^T[A-Za-z1-9]{33}$/,
        }

        const pattern = validationPatterns[currency]
        if (pattern && !pattern.test(address)) {
            return `Invalid ${currency} wallet address format`
        }

        if (address.length < 10) return 'Wallet address is too short'
        if (address.length > 100) return 'Wallet address is too long'

        return ''
    }

    const handleWalletAddressChange = (address) => {
        setCryptoWalletAddress(address)
        if (isCryptoMethod()) {
            const error = validateWalletAddress(address, selectedCurrency)
            setWalletAddressError(error)
        }
    }

    const validateAmount = (amount, account) => {
        const numAmount = parseFloat(amount)

        if (!amount || !amount.trim()) return 'Amount is required'
        if (isNaN(numAmount) || numAmount <= 0) return 'Please enter a valid amount'
        if (account && numAmount > account.balance) {
            return `Insufficient balance. Available: ${account.balance.toFixed(2)} ${account.currency}`
        }

        if (selectedWithdrawalMethod?.minWithdrawal && numAmount < selectedWithdrawalMethod.minWithdrawal) {
            return `Minimum withdrawal: ${selectedWithdrawalMethod.minWithdrawal} ${selectedAccount?.currency || 'USD'}`
        }

        if (selectedWithdrawalMethod?.maxWithdrawal && numAmount > selectedWithdrawalMethod.maxWithdrawal) {
            return `Maximum withdrawal: ${selectedWithdrawalMethod.maxWithdrawal} ${selectedAccount?.currency || 'USD'}`
        }

        return ''
    }

    const handleAmountChange = (value) => {
        setWithdrawalAmount(value)
        if (selectedAccount) {
            const error = validateAmount(value, selectedAccount)
            setAmountError(error)
        }
    }

    const handleContinueToWithdrawal = () => {
        const error = validateAmount(withdrawalAmount, selectedAccount)
        if (error) {
            setAmountError(error)
            return
        }

        const addressError = validateWalletAddress(cryptoWalletAddress, selectedCurrency)
        if (addressError) {
            setWalletAddressError(addressError)
            return
        }

        if (isFormValid) {
            setShowWithdrawalDetails(true)
        }
    }

    const mapCoinToBlockBeeTicker = (currency, network) => {
        const tickerMap = {
            USDT_ERC20: 'usdt_erc20',
            USDT_TRC20: 'usdt_trc20',
            BTC: 'btc',
            ETH: 'eth',
        }

        const key = `${currency}_${network}`.toUpperCase()
        return tickerMap[key] || currency.toLowerCase()
    }

    const handleConfirmWithdrawal = async () => {
        setIsProcessing(true)
        setWithdrawalStatus('pending')

        try {
            const blockBeeCoin = mapCoinToBlockBeeTicker(selectedCurrency, selectedNetwork)

            const withdrawalData = {
                tradingAccountId: selectedAccount._id,
                amount: parseFloat(withdrawalAmount),
                coin: blockBeeCoin,
                walletAddress: cryptoWalletAddress,
                network: selectedNetwork,
            }

            const response = await api.post('/transactions/blockbee/withdrawal/request', withdrawalData)

            if (response.data.success) {
                setWithdrawalStatus('success')
                setWithdrawalResult(response.data.data)
                setPollingWithdrawalId(response.data.data._id || response.data.data.transactionId)
                setPolledStatus('processing')
                Alert.alert('Success', 'Withdrawal request created successfully')

                if (selectedAccount) {
                    selectedAccount.balance = selectedAccount.balance - parseFloat(withdrawalAmount)
                }
            } else {
                setWithdrawalStatus('error')
                setWithdrawalResult({ error: response.data.message })
                Alert.alert('Error', response.data.message)
            }
        } catch (error) {
            console.error('Withdrawal creation error:', error)
            setWithdrawalStatus('error')
            setWithdrawalResult({
                error: error.response?.data?.message || 'Failed to create withdrawal request',
            })
            Alert.alert('Error', error.response?.data?.message || 'Failed to create withdrawal request')
        } finally {
            setIsProcessing(false)
        }
    }

    const isFormValid =
        selectedWithdrawalMethod &&
        selectedAccount &&
        withdrawalAmount &&
        !amountError &&
        cryptoWalletAddress &&
        !walletAddressError

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading withdrawal methods...</Text>
            </View>
        )
    }

    if (error && accounts.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                        Error Loading Data
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">{error}</Text>
                    <TouchableOpacity
                        onPress={fetchWithdrawalData}
                        className="bg-orange-500 px-6 py-3 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: keyboardVisible ? 300 : 40 }}
                >
                    {/* SUCCESS SCREEN */}
                    {withdrawalStatus === 'success' && (
                        <WithdrawalSuccessScreen
                            polledStatus={polledStatus}
                            polledBlockBeeStatus={polledBlockBeeStatus}
                            polledTxHash={polledTxHash}
                            isPolling={isPolling}
                            withdrawalAmount={withdrawalAmount}
                            selectedAccount={selectedAccount}
                            withdrawalResult={withdrawalResult}
                            selectedWithdrawalMethod={selectedWithdrawalMethod}
                            cryptoWalletAddress={cryptoWalletAddress}
                            selectedCurrency={selectedCurrency}
                            selectedNetwork={selectedNetwork}
                            router={router}
                            resetSelection={resetSelection}
                        />
                    )}

                    {/* ERROR SCREEN */}
                    {withdrawalStatus === 'error' && (
                        <WithdrawalErrorScreen
                            withdrawalResult={withdrawalResult}
                            setWithdrawalStatus={setWithdrawalStatus}
                            setWithdrawalResult={setWithdrawalResult}
                            setIsProcessing={setIsProcessing}
                            resetSelection={resetSelection}
                        />
                    )}

                    {/* MAIN FLOW */}
                    {!withdrawalStatus && (
                        <>
                            {!selectedWithdrawalMethod ? (
                                <MethodSelectionScreen
                                    accounts={accounts}
                                    withdrawalMethods={withdrawalMethods}
                                    handleMethodSelection={handleMethodSelection}
                                    router={router}
                                />
                            ) : !showWithdrawalDetails ? (
                                <ConfigurationScreen
                                    selectedWithdrawalMethod={selectedWithdrawalMethod}
                                    selectedNetwork={selectedNetwork}
                                    accounts={accounts}
                                    selectedAccount={selectedAccount}
                                    setSelectedAccount={setSelectedAccount}
                                    setWithdrawalAmount={setWithdrawalAmount}
                                    setAmountError={setAmountError}
                                    showAccountPicker={showAccountPicker}
                                    setShowAccountPicker={setShowAccountPicker}
                                    withdrawalAmount={withdrawalAmount}
                                    handleAmountChange={handleAmountChange}
                                    amountError={amountError}
                                    cryptoWalletAddress={cryptoWalletAddress}
                                    handleWalletAddressChange={handleWalletAddressChange}
                                    walletAddressError={walletAddressError}
                                    selectedCurrency={selectedCurrency}
                                    isFormValid={isFormValid}
                                    handleContinueToWithdrawal={handleContinueToWithdrawal}
                                    resetSelection={resetSelection}
                                />
                            ) : (
                                <ConfirmationScreen
                                    selectedWithdrawalMethod={selectedWithdrawalMethod}
                                    withdrawalAmount={withdrawalAmount}
                                    selectedAccount={selectedAccount}
                                    cryptoWalletAddress={cryptoWalletAddress}
                                    selectedCurrency={selectedCurrency}
                                    selectedNetwork={selectedNetwork}
                                    isProcessing={isProcessing}
                                    handleConfirmWithdrawal={handleConfirmWithdrawal}
                                    setShowWithdrawalDetails={setShowWithdrawalDetails}
                                />
                            )}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

// ==================== COMPONENT SCREENS ====================

// Success Screen
const WithdrawalSuccessScreen = ({
    polledStatus,
    polledBlockBeeStatus,
    polledTxHash,
    isPolling,
    withdrawalAmount,
    selectedAccount,
    withdrawalResult,
    selectedWithdrawalMethod,
    cryptoWalletAddress,
    selectedCurrency,
    selectedNetwork,
    router,
    resetSelection,
}) => (
    <View className="px-6 py-6">
        <View className="bg-white rounded-xl border border-gray-200 p-6">
            <View className="items-center mb-6">
                <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${polledStatus === 'completed'
                        ? 'bg-green-500'
                        : polledStatus === 'failed'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                    }`}>
                    {polledStatus === 'completed' ? (
                        <Ionicons name="checkmark-circle" size={40} color="white" />
                    ) : polledStatus === 'failed' ? (
                        <Ionicons name="close-circle" size={40} color="white" />
                    ) : (
                        <ActivityIndicator size="large" color="white" />
                    )}
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    {polledStatus === 'completed'
                        ? 'Withdrawal Completed!'
                        : polledStatus === 'failed'
                            ? 'Withdrawal Failed'
                            : 'Withdrawal Processing'}
                </Text>
                <Text className="text-gray-600 text-center">
                    {polledStatus === 'completed'
                        ? 'Your funds have been sent successfully'
                        : polledStatus === 'failed'
                            ? 'The withdrawal has been refunded to your account'
                            : isPolling
                                ? 'Checking blockchain status...'
                                : 'Your withdrawal is being processed'}
                </Text>
            </View>

            {polledBlockBeeStatus && (
                <View className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <Text className="text-sm text-blue-900">
                        <Text className="font-semibold">Status:</Text> {polledBlockBeeStatus}
                    </Text>
                </View>
            )}

            {polledTxHash && (
                <View className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <Text className="text-sm text-gray-600 mb-2">Transaction Hash:</Text>
                    <Text className="text-xs font-mono bg-white px-3 py-2 rounded border" selectable>
                        {polledTxHash}
                    </Text>
                </View>
            )}

            <View className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-4">
                <Text className="text-xs text-green-600 font-medium mb-1 text-center">
                    Amount Withdrawing
                </Text>
                <Text className="text-4xl font-bold text-green-900 text-center mb-1">
                    ${withdrawalAmount}
                </Text>
                <Text className="text-xs text-green-700 text-center">
                    {selectedAccount.currency}
                </Text>
            </View>

            <View style={{ gap: 8 }} className="mb-6">
                {withdrawalResult?.transactionId && (
                    <View className="bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Transaction ID</Text>
                        <Text className="text-sm font-mono text-gray-900" selectable>
                            {withdrawalResult.transactionId}
                        </Text>
                    </View>
                )}

                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Method</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedWithdrawalMethod.name}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Fee</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            ${withdrawalResult?.fee || 0}
                        </Text>
                    </View>
                </View>

                <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Text className="text-sm text-blue-600 font-medium mb-2">
                        Your {selectedCurrency} Wallet
                    </Text>
                    <Text className="text-sm font-mono text-blue-900 mb-2" selectable>
                        {cryptoWalletAddress}
                    </Text>
                    <Text className="text-xs text-blue-700">Network: {selectedNetwork}</Text>
                </View>
            </View>

            <View style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={() => router.push('/transactions')}
                    className="bg-blue-600 py-4 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-semibold text-center text-base">
                        View Transaction History
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={resetSelection}
                    className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-900 font-semibold text-center">
                        Make Another Withdrawal
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <View className="flex-row items-start">
                    <Ionicons name="information-circle" size={20} color="#2563eb" />
                    <Text className="text-xs text-blue-800 ml-2 flex-1">
                        {polledStatus === 'completed'
                            ? 'Your withdrawal has been completed successfully! The funds have been sent to your wallet.'
                            : polledStatus === 'failed'
                                ? 'Your withdrawal failed and the amount has been refunded to your account.'
                                : 'Your cryptocurrency withdrawal is being processed automatically. This typically takes a few hours.'}
                    </Text>
                </View>
            </View>
        </View>
    </View>
)

// Error Screen
const WithdrawalErrorScreen = ({
    withdrawalResult,
    setWithdrawalStatus,
    setWithdrawalResult,
    setIsProcessing,
    resetSelection,
}) => (
    <View className="px-6 py-6">
        <View className="bg-white rounded-xl border border-gray-200 p-6">
            <View className="items-center">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="close-circle" size={40} color="#dc2626" />
                </View>
                <Text className="text-xl font-bold text-red-900 mb-2 text-center">
                    Withdrawal Failed
                </Text>
                <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full">
                    <Text className="text-sm text-red-800 text-center">
                        {withdrawalResult?.error || 'An error occurred while processing your withdrawal.'}
                    </Text>
                </View>

                <View style={{ gap: 12 }} className="w-full">
                    <TouchableOpacity
                        onPress={() => {
                            setWithdrawalStatus(null)
                            setWithdrawalResult(null)
                            setIsProcessing(false)
                        }}
                        className="bg-orange-500 py-4 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-semibold text-center">Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={resetSelection}
                        className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-gray-900 font-semibold text-center">Start Over</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
)

// Method Selection Screen
const MethodSelectionScreen = ({ accounts, withdrawalMethods, handleMethodSelection, router }) => (
    <View className="px-6 py-6">
        <View className="bg-orange-500 rounded-xl p-6 mb-6">
            <View className="flex-row items-start">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                    <Ionicons name="flash" size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-lg mb-2">
                        Automated Cryptocurrency Withdrawals
                    </Text>
                    <View style={{ gap: 4 }}>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Automated processing via BlockBee
                        </Text>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Fast withdrawals (typically within hours)
                        </Text>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Secure blockchain transactions
                        </Text>
                    </View>
                </View>
            </View>
        </View>

        {accounts.length === 0 ? (
            <View className="bg-white rounded-xl border border-gray-200 p-12 items-center">
                <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
                <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2 text-center">
                    No Trading Accounts
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    You need a trading account to make withdrawals
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/new-account')}
                    className="bg-orange-500 px-6 py-3 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-semibold">Create Trading Account</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <>
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        Choose Withdrawal Method
                    </Text>
                    <Text className="text-gray-600">
                        Select your preferred cryptocurrency
                    </Text>
                </View>

                <View style={{ gap: 12 }}>
                    {withdrawalMethods.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() => handleMethodSelection(option)}
                            className="bg-white rounded-xl p-6 border-2 border-gray-200"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-row items-center flex-1">
                                    {option.image ? (
                                        <Image
                                            source={{ uri: option.image }}
                                            style={{ width: 40, height: 40 }}
                                            className="rounded-full mr-3"
                                        />
                                    ) : (
                                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                                            <Text className="text-xl">💰</Text>
                                        </View>
                                    )}
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">
                                            {option.name}
                                        </Text>
                                        {option.network && (
                                            <Text className="text-sm text-gray-600">
                                                Network: {option.network}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {option.recommended && (
                                    <View className="px-2 py-1 bg-green-100 rounded-full">
                                        <Text className="text-green-800 text-xs font-medium">
                                            Recommended
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ gap: 8 }}>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-gray-600">Processing time</Text>
                                    <Text className="text-sm font-medium text-gray-900">
                                        {option.processingTime}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-gray-600">Fee</Text>
                                    <Text className="text-sm font-medium text-green-600">
                                        {option.fee}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-gray-600">Limits</Text>
                                    <Text className="text-sm font-medium text-gray-900">
                                        {option.limits}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-end mt-2">
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </>
        )}
    </View>
)

// Configuration Screen (continues...)
const ConfigurationScreen = ({
    selectedWithdrawalMethod,
    selectedNetwork,
    accounts,
    selectedAccount,
    setSelectedAccount,
    setWithdrawalAmount,
    setAmountError,
    showAccountPicker,
    setShowAccountPicker,
    withdrawalAmount,
    handleAmountChange,
    amountError,
    cryptoWalletAddress,
    handleWalletAddressChange,
    walletAddressError,
    selectedCurrency,
    isFormValid,
    handleContinueToWithdrawal,
    resetSelection,
}) => (
    <View className="px-6 py-6">
        <TouchableOpacity
            onPress={resetSelection}
            className="flex-row items-center mb-6"
            activeOpacity={0.7}
        >
            <Ionicons name="arrow-back" size={20} color="#374151" />
            <Text className="text-gray-700 ml-2">Back to methods</Text>
        </TouchableOpacity>

        {/* Selected Method */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Withdrawal Method</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
                {selectedWithdrawalMethod.image ? (
                    <Image
                        source={{ uri: selectedWithdrawalMethod.image }}
                        style={{ width: 40, height: 40 }}
                        className="rounded-full mr-3"
                    />
                ) : (
                    <Text className="text-3xl mr-3">💰</Text>
                )}
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                        {selectedWithdrawalMethod.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Network: {selectedNetwork}
                    </Text>
                </View>
            </View>

            <View className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <View className="flex-row items-center">
                    <Ionicons name="flash" size={16} color="#7c3aed" />
                    <Text className="text-purple-800 text-sm font-medium ml-2">
                        Automated via BlockBee • Fast Processing
                    </Text>
                </View>
            </View>
        </View>

        {/* Account Selection */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">From Account</Text>
            <TouchableOpacity
                onPress={() => setShowAccountPicker(!showAccountPicker)}
                className={`px-4 py-4 border-2 rounded-lg flex-row items-center justify-between ${selectedAccount ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                    }`}
                activeOpacity={0.7}
            >
                <Text className={`text-sm ${selectedAccount ? 'text-green-900' : 'text-gray-500'}`}>
                    {selectedAccount
                        ? `${selectedAccount.accountNumber} - ${selectedAccount.platform} (Balance: $${selectedAccount.balance.toFixed(2)})`
                        : 'Select your account'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={selectedAccount ? '#15803d' : '#9ca3af'} />
            </TouchableOpacity>

            {showAccountPicker && (
                <View className="mt-3 border border-gray-300 rounded-lg overflow-hidden">
                    {accounts.map((account, index) => (
                        <TouchableOpacity
                            key={account._id}
                            onPress={() => {
                                setSelectedAccount(account)
                                setShowAccountPicker(false)
                                setWithdrawalAmount('')
                                setAmountError('')
                            }}
                            className={`px-4 py-3 ${index < accounts.length - 1 ? 'border-b border-gray-100' : ''} ${selectedAccount?._id === account._id ? 'bg-green-50' : 'bg-white'
                                }`}
                            activeOpacity={0.7}
                        >
                            <Text className={`text-sm ${selectedAccount?._id === account._id ? 'text-green-900 font-semibold' : 'text-gray-900'}`}>
                                {account.accountNumber} - {account.platform}
                            </Text>
                            <Text className="text-xs text-gray-600 mt-0.5">
                                Balance: ${account.balance.toFixed(2)} {account.currency}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {selectedAccount && (
                <View className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#15803d" />
                        <Text className="text-green-800 text-xs font-medium ml-2">
                            Available: ${selectedAccount.balance.toFixed(2)} {selectedAccount.currency}
                        </Text>
                    </View>
                </View>
            )}
        </View>

        {/* Amount Input */}
        {selectedAccount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">Withdrawal Amount</Text>
                <View className="relative">
                    <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}>
                        <Text className="text-gray-500 text-2xl">$</Text>
                    </View>
                    <TextInput
                        placeholder="0.00"
                        value={withdrawalAmount}
                        onChangeText={handleAmountChange}
                        keyboardType="numeric"
                        className={`pl-12 pr-20 py-4 text-2xl font-semibold border-2 rounded-lg ${amountError
                                ? 'border-red-300 bg-red-50'
                                : withdrawalAmount && !amountError
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300'
                            }`}
                    />
                    <View style={{ position: 'absolute', right: 16, top: 16 }}>
                        <Text className="text-gray-500 text-xl font-medium">
                            {selectedAccount.currency}
                        </Text>
                    </View>
                </View>

                {amountError && (
                    <View className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <View className="flex-row items-center">
                            <Ionicons name="alert-circle" size={16} color="#dc2626" />
                            <Text className="text-red-700 text-xs font-medium ml-2">
                                {amountError}
                            </Text>
                        </View>
                    </View>
                )}

                <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-xs text-gray-600">
                        Min: ${selectedWithdrawalMethod.minWithdrawal || 10}
                    </Text>
                    <Text className="text-xs text-gray-600">
                        Max: ${selectedWithdrawalMethod.maxWithdrawal || 100000}
                    </Text>
                </View>
            </View>
        )}

        {/* Wallet Address */}
        {selectedAccount && withdrawalAmount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                    Your {selectedCurrency} Wallet Address
                </Text>
                <TextInput
                    placeholder={`Enter your ${selectedCurrency} wallet address`}
                    value={cryptoWalletAddress}
                    onChangeText={handleWalletAddressChange}
                    className={`p-4 border-2 rounded-lg font-mono text-sm ${walletAddressError
                            ? 'border-red-300 bg-red-50'
                            : cryptoWalletAddress && !walletAddressError
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-300'
                        }`}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {walletAddressError && (
                    <View className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <View className="flex-row items-center">
                            <Ionicons name="alert-circle" size={16} color="#dc2626" />
                            <Text className="text-red-700 text-xs font-medium ml-2">
                                {walletAddressError}
                            </Text>
                        </View>
                    </View>
                )}

                <View className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <View className="flex-row items-center">
                        <Ionicons name="information-circle" size={16} color="#2563eb" />
                        <Text className="text-blue-800 text-xs ml-2">
                            <Text className="font-semibold">Network:</Text> {selectedNetwork}
                        </Text>
                    </View>
                </View>
            </View>
        )}

        {/* Continue Button */}
        {selectedAccount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6">
                <TouchableOpacity
                    onPress={handleContinueToWithdrawal}
                    disabled={!isFormValid}
                    className={`py-4 rounded-lg ${!isFormValid ? 'bg-gray-300' : 'bg-orange-500'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text className={`text-center font-semibold text-base ${!isFormValid ? 'text-gray-500' : 'text-white'
                        }`}>
                        {!isFormValid ? 'Complete all required fields' : 'Continue to Confirmation'}
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
)

// Confirmation Screen
const ConfirmationScreen = ({
    selectedWithdrawalMethod,
    withdrawalAmount,
    selectedAccount,
    cryptoWalletAddress,
    selectedCurrency,
    selectedNetwork,
    isProcessing,
    handleConfirmWithdrawal,
    setShowWithdrawalDetails,
}) => (
    <View className="px-6 py-6">
        <TouchableOpacity
            onPress={() => setShowWithdrawalDetails(false)}
            disabled={isProcessing}
            className="flex-row items-center mb-6"
            activeOpacity={0.7}
        >
            <Ionicons name="arrow-back" size={20} color="#374151" />
            <Text className="text-gray-700 ml-2">Back to configuration</Text>
        </TouchableOpacity>

        <View className="bg-white rounded-xl border border-gray-200 p-6">
            <View className="items-center mb-6">
                <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4">
                    {selectedWithdrawalMethod.image ? (
                        <Image
                            source={{ uri: selectedWithdrawalMethod.image }}
                            style={{ width: 40, height: 40 }}
                            className="rounded-full"
                        />
                    ) : (
                        <Text className="text-3xl">💰</Text>
                    )}
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Confirm Withdrawal
                </Text>
                <Text className="text-gray-600 text-center">
                    Review details before submitting
                </Text>
            </View>

            {/* Amount */}
            <View className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
                <Text className="text-xs text-blue-600 font-medium mb-1 text-center">
                    Withdrawal Amount
                </Text>
                <Text className="text-4xl font-bold text-blue-900 text-center">
                    ${withdrawalAmount}
                </Text>
            </View>

            {/* Wallet */}
            <View className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <Text className="text-sm text-blue-600 font-medium mb-2">
                    Your {selectedCurrency} Wallet
                </Text>
                <Text className="text-sm font-mono text-blue-900 mb-2" selectable>
                    {cryptoWalletAddress}
                </Text>
                <Text className="text-xs text-blue-700">Network: {selectedNetwork}</Text>
            </View>

            {/* Details */}
            <View style={{ gap: 8 }} className="mb-6">
                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Method</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedWithdrawalMethod.name}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Account</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedAccount.accountNumber}
                        </Text>
                    </View>
                </View>
                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Fee</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            ${selectedWithdrawalMethod.fee || 0}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Net Amount</Text>
                        <Text className="font-semibold text-green-600 text-sm">
                            ${(parseFloat(withdrawalAmount) - (selectedWithdrawalMethod.fee || 0)).toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={handleConfirmWithdrawal}
                    disabled={isProcessing}
                    className={`py-4 rounded-lg ${isProcessing ? 'bg-gray-300' : 'bg-blue-600'}`}
                    activeOpacity={0.7}
                >
                    {isProcessing ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator size="small" color="#ffffff" />
                            <Text className="text-white font-semibold ml-2">
                                Processing...
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="flash" size={18} color="white" />
                            <Text className="text-white font-semibold ml-2 text-base">
                                Confirm Withdrawal
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowWithdrawalDetails(false)}
                    disabled={isProcessing}
                    className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-900 font-semibold text-center">
                        Review Details
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Warning */}
            <View className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <View className="flex-row items-start">
                    <Ionicons name="alert-circle" size={20} color="#d97706" />
                    <Text className="text-xs text-amber-800 ml-2 flex-1">
                        <Text className="font-bold">Important:</Text> Please verify all details carefully. Ensure the wallet address is correct for the {selectedNetwork} network. Withdrawals cannot be reversed once processed.
                    </Text>
                </View>
            </View>
        </View>
    </View>
)

export default Withdrawal
