import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import api from '@/services/api'

const TRANSFER_OPTIONS = [
    {
        id: 'betweenaccounts',
        name: 'Between My Accounts',
        type: 'internal',
        description: 'Transfer between your trading accounts',
        network: 'Internal',
        image: 'https://img.icons8.com/3d-fluency/94/exchange.png',
        fee: 0,
        processingTime: 'Instant',
        isActive: true,
        recommended: true,
    },
    {
        id: 'toanotheruser',
        name: 'To Another User',
        type: 'internal',
        description: 'Transfer to another user account',
        network: 'Internal',
        image: 'https://img.icons8.com/3d-fluency/94/user-group-man-man.png',
        fee: 0,
        processingTime: '5-10 minutes',
        isActive: true,
        recommended: false,
    },
]

const TRANSFER_REASONS = [
    { id: 'investment', name: 'Investment' },
    { id: 'payment', name: 'Payment for services' },
    { id: 'gift', name: 'Gift' },
    { id: 'loan', name: 'Loan repayment' },
    { id: 'trading', name: 'Trading capital' },
    { id: 'other', name: 'Other' },
]

const Transfer = () => {
    const router = useRouter()
    const params = useLocalSearchParams()

    // Data
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Form
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedFromAccount, setSelectedFromAccount] = useState(null)
    const [selectedToAccount, setSelectedToAccount] = useState(null)
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('')
    const [recipientEmail, setRecipientEmail] = useState('')
    const [transferReason, setTransferReason] = useState('')
    const [transferAmount, setTransferAmount] = useState('')
    const [transferNote, setTransferNote] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)

    // Validation
    const [amountError, setAmountError] = useState('')
    const [accountError, setAccountError] = useState('')
    const [recipientError, setRecipientError] = useState('')

    // Status
    const [isProcessing, setIsProcessing] = useState(false)
    const [transferStatus, setTransferStatus] = useState(null)
    const [transferResult, setTransferResult] = useState(null)

    // UI
    const [showFromAccountPicker, setShowFromAccountPicker] = useState(false)
    const [showToAccountPicker, setShowToAccountPicker] = useState(false)
    const [showReasonPicker, setShowReasonPicker] = useState(false)
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    useEffect(() => {
        fetchTransferData()

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

    // Handle pre-selected account from params
    useEffect(() => {
        if (accounts.length > 0 && params.account) {
            const account = accounts.find(acc => acc._id === params.account)
            if (account) {
                setSelectedFromAccount(account)
                // Auto-select between accounts method
                const betweenAccountsMethod = TRANSFER_OPTIONS.find(opt => opt.id === 'betweenaccounts')
                if (betweenAccountsMethod) {
                    handleMethodSelection(betweenAccountsMethod)
                }
            }
        }
    }, [accounts, params.account])

    const fetchTransferData = async () => {
        setLoading(true)
        try {
            const accountsResponse = await api.get('/account/my-accounts')

            if (accountsResponse.data.success) {
                const realAccounts = accountsResponse.data.data.filter(acc => acc.accountType === 'Real')
                setAccounts(realAccounts)
            }

            setError(null)
        } catch (err) {
            console.error('Error fetching transfer data:', err)
            setError(err.response?.data?.message || 'Failed to load transfer data')
            Alert.alert('Error', 'Failed to load transfer data')
        } finally {
            setLoading(false)
        }
    }

    const validateAmount = (amount, account) => {
        const numAmount = parseFloat(amount)

        if (!amount || amount.trim() === '') return 'Amount is required'
        if (isNaN(numAmount) || numAmount <= 0) return 'Please enter a valid amount'
        if (account && numAmount > account.balance) {
            return `Insufficient balance. Available: ${account.balance.toFixed(2)} ${account.currency}`
        }
        if (numAmount < 1) return 'Minimum transfer amount is 1'

        return ''
    }

    const handleMethodSelection = (method) => {
        setSelectedMethod(method)
        // Don't reset from account if set via params
        if (!params.account) {
            setSelectedFromAccount(null)
        }
        setSelectedToAccount(null)
        setRecipientAccountNumber('')
        setRecipientEmail('')
        setTransferReason('')
        setTransferAmount('')
        setTransferNote('')
        setAmountError('')
        setAccountError('')
        setRecipientError('')
        setShowConfirmation(false)
    }

    const handleContinueToConfirmation = () => {
        const amountErr = validateAmount(transferAmount, selectedFromAccount)
        if (amountErr) {
            setAmountError(amountErr)
            return
        }

        if (selectedMethod?.id === 'betweenaccounts') {
            if (!selectedFromAccount || !selectedToAccount) {
                setAccountError('Please select both source and destination accounts')
                return
            }
            if (selectedFromAccount._id === selectedToAccount._id) {
                setAccountError('Source and destination accounts must be different')
                return
            }
        }

        if (selectedMethod?.id === 'toanotheruser') {
            if (!recipientAccountNumber || !recipientEmail || !transferReason) {
                setRecipientError('Please fill all required fields')
                return
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(recipientEmail)) {
                setRecipientError('Please enter a valid email address')
                return
            }
        }

        setShowConfirmation(true)
    }

    const handleConfirmTransfer = async () => {
        setIsProcessing(true)
        setTransferStatus('pending')

        try {
            const transferData = {
                methodId: selectedMethod.id,
                methodType: selectedMethod.type,
                fromAccountId: selectedFromAccount._id,
                amount: parseFloat(transferAmount),
                currency: selectedFromAccount.currency,
                metadata: {
                    note: transferNote,
                },
            }

            if (selectedMethod.id === 'betweenaccounts') {
                transferData.toAccountId = selectedToAccount._id
            }

            if (selectedMethod.id === 'toanotheruser') {
                transferData.recipientAccountNumber = recipientAccountNumber
                transferData.recipientEmail = recipientEmail
                transferData.transferReason = transferReason
            }

            const response = await api.post('/transactions/transfers', transferData)

            if (response.data.success) {
                setTransferStatus('success')
                setTransferResult(response.data.data)
                Alert.alert('Success', 'Transfer completed successfully')
                fetchTransferData() // Refresh accounts
            } else {
                throw new Error(response.data.message || 'Transfer failed')
            }
        } catch (error) {
            console.error('Transfer error:', error)
            setTransferStatus('error')
            setTransferResult({
                error: error.message || error.response?.data?.message || 'Transfer failed',
            })
            Alert.alert('Error', error.message || error.response?.data?.message || 'Transfer failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const resetSelection = () => {
        setSelectedMethod(null)
        setSelectedFromAccount(null)
        setSelectedToAccount(null)
        setRecipientAccountNumber('')
        setRecipientEmail('')
        setTransferReason('')
        setTransferAmount('')
        setTransferNote('')
        setAmountError('')
        setAccountError('')
        setRecipientError('')
        setShowConfirmation(false)
        setTransferStatus(null)
        setTransferResult(null)
    }

    const isFormValid = () => {
        if (!selectedFromAccount || !transferAmount || amountError) return false

        if (selectedMethod?.id === 'betweenaccounts') {
            return selectedToAccount && !accountError
        }

        if (selectedMethod?.id === 'toanotheruser') {
            return recipientAccountNumber && recipientEmail && transferReason && !recipientError
        }

        return false
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading transfer options...</Text>
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
                        onPress={fetchTransferData}
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
                    {transferStatus === 'success' && (
                        <TransferSuccessScreen
                            transferAmount={transferAmount}
                            selectedFromAccount={selectedFromAccount}
                            selectedToAccount={selectedToAccount}
                            recipientAccountNumber={recipientAccountNumber}
                            transferResult={transferResult}
                            selectedMethod={selectedMethod}
                            router={router}
                            resetSelection={resetSelection}
                        />
                    )}

                    {/* ERROR SCREEN */}
                    {transferStatus === 'error' && (
                        <TransferErrorScreen
                            transferResult={transferResult}
                            setTransferStatus={setTransferStatus}
                            setShowConfirmation={setShowConfirmation}
                            resetSelection={resetSelection}
                        />
                    )}

                    {/* MAIN FLOW */}
                    {!transferStatus && (
                        <>
                            {!selectedMethod ? (
                                /* Step 1: Method Selection */
                                <MethodSelectionScreen
                                    accounts={accounts}
                                    transferOptions={TRANSFER_OPTIONS}
                                    handleMethodSelection={handleMethodSelection}
                                    router={router}
                                />
                            ) : !showConfirmation ? (
                                /* Step 2: Configuration */
                                <ConfigurationScreen
                                    selectedMethod={selectedMethod}
                                    accounts={accounts}
                                    selectedFromAccount={selectedFromAccount}
                                    setSelectedFromAccount={setSelectedFromAccount}
                                    selectedToAccount={selectedToAccount}
                                    setSelectedToAccount={setSelectedToAccount}
                                    recipientAccountNumber={recipientAccountNumber}
                                    setRecipientAccountNumber={setRecipientAccountNumber}
                                    recipientEmail={recipientEmail}
                                    setRecipientEmail={setRecipientEmail}
                                    transferReason={transferReason}
                                    setTransferReason={setTransferReason}
                                    transferReasons={TRANSFER_REASONS}
                                    transferAmount={transferAmount}
                                    setTransferAmount={setTransferAmount}
                                    transferNote={transferNote}
                                    setTransferNote={setTransferNote}
                                    amountError={amountError}
                                    setAmountError={setAmountError}
                                    accountError={accountError}
                                    setAccountError={setAccountError}
                                    recipientError={recipientError}
                                    setRecipientError={setRecipientError}
                                    showFromAccountPicker={showFromAccountPicker}
                                    setShowFromAccountPicker={setShowFromAccountPicker}
                                    showToAccountPicker={showToAccountPicker}
                                    setShowToAccountPicker={setShowToAccountPicker}
                                    showReasonPicker={showReasonPicker}
                                    setShowReasonPicker={setShowReasonPicker}
                                    validateAmount={validateAmount}
                                    isFormValid={isFormValid()}
                                    handleContinueToConfirmation={handleContinueToConfirmation}
                                    resetSelection={resetSelection}
                                />
                            ) : (
                                /* Step 3: Confirmation */
                                <ConfirmationScreen
                                    selectedMethod={selectedMethod}
                                    selectedFromAccount={selectedFromAccount}
                                    selectedToAccount={selectedToAccount}
                                    recipientAccountNumber={recipientAccountNumber}
                                    recipientEmail={recipientEmail}
                                    transferReason={transferReason}
                                    transferReasons={TRANSFER_REASONS}
                                    transferAmount={transferAmount}
                                    transferNote={transferNote}
                                    isProcessing={isProcessing}
                                    handleConfirmTransfer={handleConfirmTransfer}
                                    setShowConfirmation={setShowConfirmation}
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
const TransferSuccessScreen = ({
    transferAmount,
    selectedFromAccount,
    selectedToAccount,
    recipientAccountNumber,
    transferResult,
    selectedMethod,
    router,
    resetSelection,
}) => (
    <View className="px-6 py-6">
        <View className="bg-white rounded-xl border border-gray-200 p-6">
            <View className="items-center mb-6">
                <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
                    <Ionicons name="checkmark-circle" size={40} color="white" />
                </View>
                <Text className="text-2xl font-bold text-green-900 mb-2 text-center">
                    Transfer Completed!
                </Text>
                <Text className="text-gray-600 text-center">
                    Your transfer has been processed successfully
                </Text>
            </View>

            <View className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-4">
                <Text className="text-xs text-green-600 font-medium mb-1 text-center">
                    Amount Transferred
                </Text>
                <Text className="text-4xl font-bold text-green-900 text-center">
                    {transferAmount} {selectedFromAccount.currency}
                </Text>
            </View>

            <View style={{ gap: 8 }} className="mb-6">
                {transferResult?.transactionId && (
                    <View className="bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Transaction ID</Text>
                        <Text className="text-sm font-mono text-gray-900" selectable>
                            {transferResult.transactionId}
                        </Text>
                    </View>
                )}

                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">From</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {transferResult?.from || selectedFromAccount.accountNumber}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">To</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {transferResult?.to || selectedToAccount?.accountNumber || recipientAccountNumber}
                        </Text>
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Status</Text>
                        <Text className="font-semibold text-green-600 text-sm">
                            {transferResult?.status || 'Completed'}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4">
                        <Text className="text-xs text-gray-600 mb-1">Processing Time</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedMethod.processingTime}
                        </Text>
                    </View>
                </View>

                {transferResult?.reason && (
                    <View className="bg-blue-50 rounded-lg p-4">
                        <Text className="text-xs text-blue-600 mb-1">Reason</Text>
                        <Text className="text-sm text-blue-900">{transferResult.reason}</Text>
                    </View>
                )}
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
                        Make Another Transfer
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)

// Error Screen
const TransferErrorScreen = ({
    transferResult,
    setTransferStatus,
    setShowConfirmation,
    resetSelection,
}) => (
    <View className="px-6 py-6">
        <View className="bg-white rounded-xl border border-gray-200 p-6">
            <View className="items-center">
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="close-circle" size={40} color="#dc2626" />
                </View>
                <Text className="text-xl font-bold text-red-900 mb-2 text-center">
                    Transfer Failed
                </Text>
                <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full">
                    <Text className="text-sm text-red-800 text-center">
                        {transferResult?.error || 'An error occurred during the transfer'}
                    </Text>
                </View>

                <View style={{ gap: 12 }} className="w-full">
                    <TouchableOpacity
                        onPress={() => {
                            setTransferStatus(null)
                            setShowConfirmation(false)
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
const MethodSelectionScreen = ({ accounts, transferOptions, handleMethodSelection, router }) => (
    <View className="px-6 py-6">
        <View className="bg-orange-500 rounded-xl p-6 mb-6">
            <View className="flex-row items-start">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                    <Ionicons name="swap-horizontal" size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-lg mb-2">
                        Internal Transfers
                    </Text>
                    <View style={{ gap: 4 }}>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Instant transfers between accounts
                        </Text>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Zero fees
                        </Text>
                        <Text className="text-white text-xs opacity-90">
                            ✓ Secure and reliable
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
                    You need at least one trading account to make transfers
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
                        Choose Transfer Method
                    </Text>
                    <Text className="text-gray-600">
                        Select how you want to transfer your funds
                    </Text>
                </View>

                <View style={{ gap: 12 }}>
                    {transferOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() => handleMethodSelection(option)}
                            className="bg-white rounded-xl p-6 border-2 border-gray-200"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-row items-center flex-1">
                                    <Image
                                        source={{ uri: option.image }}
                                        style={{ width: 48, height: 48 }}
                                        className="rounded-full mr-3"
                                    />
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">
                                            {option.name}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            {option.description}
                                        </Text>
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
                                        {option.fee === 0 ? 'Free' : `${option.fee} USD`}
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

// Configuration Screen
const ConfigurationScreen = ({
    selectedMethod,
    accounts,
    selectedFromAccount,
    setSelectedFromAccount,
    selectedToAccount,
    setSelectedToAccount,
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientEmail,
    setRecipientEmail,
    transferReason,
    setTransferReason,
    transferReasons,
    transferAmount,
    setTransferAmount,
    transferNote,
    setTransferNote,
    amountError,
    setAmountError,
    accountError,
    setAccountError,
    recipientError,
    setRecipientError,
    showFromAccountPicker,
    setShowFromAccountPicker,
    showToAccountPicker,
    setShowToAccountPicker,
    showReasonPicker,
    setShowReasonPicker,
    validateAmount,
    isFormValid,
    handleContinueToConfirmation,
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
            <Text className="text-lg font-bold text-gray-900 mb-4">Transfer Method</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
                <Image
                    source={{ uri: selectedMethod.image }}
                    style={{ width: 48, height: 48 }}
                    className="rounded-full mr-3"
                />
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                        {selectedMethod.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                        {selectedMethod.description}
                    </Text>
                </View>
            </View>

            <View className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <View className="flex-row items-center">
                    <Ionicons name="flash" size={16} color="#15803d" />
                    <Text className="text-green-800 text-sm font-medium ml-2">
                        {selectedMethod.processingTime} • {selectedMethod.fee === 0 ? 'Free' : `Fee: ${selectedMethod.fee} USD`}
                    </Text>
                </View>
            </View>
        </View>

        {/* From Account Selection */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">From Account</Text>
            <TouchableOpacity
                onPress={() => setShowFromAccountPicker(!showFromAccountPicker)}
                className={`px-4 py-4 border-2 rounded-lg flex-row items-center justify-between ${selectedFromAccount ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                    }`}
                activeOpacity={0.7}
            >
                <Text className={`text-sm ${selectedFromAccount ? 'text-green-900' : 'text-gray-500'}`}>
                    {selectedFromAccount
                        ? `${selectedFromAccount.accountNumber} - ${selectedFromAccount.platform} (Balance: $${selectedFromAccount.balance.toFixed(2)})`
                        : 'Select source account'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={selectedFromAccount ? '#15803d' : '#9ca3af'} />
            </TouchableOpacity>

            {showFromAccountPicker && (
                <View className="mt-3 border border-gray-300 rounded-lg overflow-hidden">
                    {accounts.map((account, index) => (
                        <TouchableOpacity
                            key={account._id}
                            onPress={() => {
                                setSelectedFromAccount(account)
                                setShowFromAccountPicker(false)
                                setTransferAmount('')
                                setAmountError('')
                                setAccountError('')
                            }}
                            className={`px-4 py-3 ${index < accounts.length - 1 ? 'border-b border-gray-100' : ''} ${selectedFromAccount?._id === account._id ? 'bg-green-50' : 'bg-white'
                                }`}
                            activeOpacity={0.7}
                        >
                            <Text className={`text-sm ${selectedFromAccount?._id === account._id ? 'text-green-900 font-semibold' : 'text-gray-900'}`}>
                                {account.accountNumber} - {account.platform}
                            </Text>
                            <Text className="text-xs text-gray-600 mt-0.5">
                                Balance: ${account.balance.toFixed(2)} {account.currency}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {selectedFromAccount && (
                <View className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#15803d" />
                        <Text className="text-green-800 text-xs font-medium ml-2">
                            Available: ${selectedFromAccount.balance.toFixed(2)} {selectedFromAccount.currency}
                        </Text>
                    </View>
                </View>
            )}
        </View>

        {/* Between Accounts - To Account Selection */}
        {selectedMethod.id === 'betweenaccounts' && selectedFromAccount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">To Account</Text>
                <TouchableOpacity
                    onPress={() => setShowToAccountPicker(!showToAccountPicker)}
                    className={`px-4 py-4 border-2 rounded-lg flex-row items-center justify-between ${selectedToAccount ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text className={`text-sm ${selectedToAccount ? 'text-blue-900' : 'text-gray-500'}`}>
                        {selectedToAccount
                            ? `${selectedToAccount.accountNumber} - ${selectedToAccount.platform}`
                            : 'Select destination account'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={selectedToAccount ? '#1e40af' : '#9ca3af'} />
                </TouchableOpacity>

                {showToAccountPicker && (
                    <View className="mt-3 border border-gray-300 rounded-lg overflow-hidden">
                        {accounts
                            .filter(acc => acc._id !== selectedFromAccount._id)
                            .map((account, index) => (
                                <TouchableOpacity
                                    key={account._id}
                                    onPress={() => {
                                        setSelectedToAccount(account)
                                        setShowToAccountPicker(false)
                                        setAccountError('')
                                    }}
                                    className={`px-4 py-3 ${index < accounts.filter(a => a._id !== selectedFromAccount._id).length - 1 ? 'border-b border-gray-100' : ''} ${selectedToAccount?._id === account._id ? 'bg-blue-50' : 'bg-white'
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-sm ${selectedToAccount?._id === account._id ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}>
                                        {account.accountNumber} - {account.platform}
                                    </Text>
                                    <Text className="text-xs text-gray-600 mt-0.5">
                                        Balance: ${account.balance.toFixed(2)} {account.currency}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                )}

                {accountError && (
                    <View className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text className="text-red-700 text-xs">{accountError}</Text>
                    </View>
                )}
            </View>
        )}

        {/* To Another User - Recipient Info */}
        {selectedMethod.id === 'toanotheruser' && selectedFromAccount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">Recipient Information</Text>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Account Number</Text>
                    <TextInput
                        placeholder="Enter recipient account number"
                        value={recipientAccountNumber}
                        onChangeText={(text) => {
                            setRecipientAccountNumber(text)
                            setRecipientError('')
                        }}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                        autoCapitalize="none"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
                    <TextInput
                        placeholder="Enter recipient email"
                        value={recipientEmail}
                        onChangeText={(text) => {
                            setRecipientEmail(text)
                            setRecipientError('')
                        }}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Transfer Reason</Text>
                    <TouchableOpacity
                        onPress={() => setShowReasonPicker(!showReasonPicker)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <Text className={transferReason ? 'text-gray-900' : 'text-gray-500'}>
                            {transferReason ? transferReasons.find(r => r.id === transferReason)?.name : 'Select reason'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    {showReasonPicker && (
                        <View className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                            {transferReasons.map((reason, index) => (
                                <TouchableOpacity
                                    key={reason.id}
                                    onPress={() => {
                                        setTransferReason(reason.id)
                                        setShowReasonPicker(false)
                                        setRecipientError('')
                                    }}
                                    className={`px-4 py-3 ${index < transferReasons.length - 1 ? 'border-b border-gray-100' : ''} ${transferReason === reason.id ? 'bg-blue-50' : 'bg-white'
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={transferReason === reason.id ? 'text-blue-900 font-semibold' : 'text-gray-900'}>
                                        {reason.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {recipientError && (
                    <View className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text className="text-red-700 text-xs">{recipientError}</Text>
                    </View>
                )}
            </View>
        )}

        {/* Amount Input */}
        {selectedFromAccount && (selectedMethod.id === 'betweenaccounts' ? selectedToAccount : recipientAccountNumber) && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">Transfer Amount</Text>
                <View className="relative">
                    <TextInput
                        placeholder="0.00"
                        value={transferAmount}
                        onChangeText={(value) => {
                            setTransferAmount(value)
                            const error = validateAmount(value, selectedFromAccount)
                            setAmountError(error)
                        }}
                        keyboardType="numeric"
                        className={`pl-4 pr-20 py-4 text-2xl font-semibold border-2 rounded-lg ${amountError
                            ? 'border-red-300 bg-red-50'
                            : transferAmount && !amountError
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-300'
                            }`}
                    />
                    <View style={{ position: 'absolute', right: 16, top: 16 }}>
                        <Text className="text-gray-500 text-xl font-medium">
                            {selectedFromAccount.currency}
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
                    <Text className="text-xs text-gray-600">Minimum: 1 {selectedFromAccount.currency}</Text>
                    <Text className="text-xs text-gray-600">
                        Available: ${selectedFromAccount.balance.toFixed(2)}
                    </Text>
                </View>
            </View>
        )}

        {/* Optional Note */}
        {transferAmount && !amountError && (
            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-4">Add Note (Optional)</Text>
                <TextInput
                    placeholder="Add a note for this transfer..."
                    value={transferNote}
                    onChangeText={setTransferNote}
                    multiline
                    numberOfLines={3}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                    textAlignVertical="top"
                />
            </View>
        )}

        {/* Continue Button */}
        {selectedFromAccount && (
            <View className="bg-white rounded-xl border border-gray-200 p-6">
                <TouchableOpacity
                    onPress={handleContinueToConfirmation}
                    disabled={!isFormValid}
                    className={`py-4 rounded-lg ${!isFormValid ? 'bg-gray-300' : 'bg-orange-500'}`}
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
    selectedMethod,
    selectedFromAccount,
    selectedToAccount,
    recipientAccountNumber,
    recipientEmail,
    transferReason,
    transferReasons,
    transferAmount,
    transferNote,
    isProcessing,
    handleConfirmTransfer,
    setShowConfirmation,
}) => (
    <View className="px-6 py-6">
        <TouchableOpacity
            onPress={() => setShowConfirmation(false)}
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
                    <Image
                        source={{ uri: selectedMethod.image }}
                        style={{ width: 40, height: 40 }}
                        className="rounded-full"
                    />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Confirm Transfer
                </Text>
                <Text className="text-gray-600 text-center">
                    Review details before submitting
                </Text>
            </View>

            {/* Amount */}
            <View className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
                <Text className="text-xs text-blue-600 font-medium mb-1 text-center">
                    Transfer Amount
                </Text>
                <Text className="text-4xl font-bold text-blue-900 text-center">
                    {transferAmount} {selectedFromAccount.currency}
                </Text>
            </View>

            {/* Transfer Details */}
            <View style={{ gap: 8 }} className="mb-6">
                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">From</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedFromAccount.accountNumber}
                        </Text>
                        <Text className="text-xs text-gray-600 mt-0.5">
                            {selectedFromAccount.platform}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">To</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedToAccount?.accountNumber || recipientAccountNumber}
                        </Text>
                        {selectedToAccount && (
                            <Text className="text-xs text-gray-600 mt-0.5">
                                {selectedToAccount.platform}
                            </Text>
                        )}
                        {recipientEmail && (
                            <Text className="text-xs text-gray-600 mt-0.5">
                                {recipientEmail}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Method</Text>
                        <Text className="font-semibold text-gray-900 text-sm">
                            {selectedMethod.name}
                        </Text>
                    </View>
                    <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Fee</Text>
                        <Text className="font-semibold text-green-600 text-sm">
                            {selectedMethod.fee === 0 ? 'Free' : `${selectedMethod.fee} USD`}
                        </Text>
                    </View>
                </View>

                {transferReason && (
                    <View className="bg-blue-50 rounded-lg p-4">
                        <Text className="text-xs text-blue-600 mb-1">Transfer Reason</Text>
                        <Text className="text-sm text-blue-900">
                            {transferReasons.find(r => r.id === transferReason)?.name}
                        </Text>
                    </View>
                )}

                {transferNote && (
                    <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Text className="text-xs text-gray-600 mb-1">Note</Text>
                        <Text className="text-sm text-gray-900">{transferNote}</Text>
                    </View>
                )}
            </View>

            {/* Actions */}
            <View style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={handleConfirmTransfer}
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
                            <Ionicons name="checkmark-circle" size={18} color="white" />
                            <Text className="text-white font-semibold ml-2 text-base">
                                Confirm Transfer
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowConfirmation(false)}
                    disabled={isProcessing}
                    className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-gray-900 font-semibold text-center">
                        Review Details
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Info */}
            <View className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <View className="flex-row items-start">
                    <Ionicons name="information-circle" size={20} color="#2563eb" />
                    <Text className="text-xs text-blue-800 ml-2 flex-1">
                        <Text className="font-bold">Note:</Text> {selectedMethod.processingTime === 'Instant'
                            ? 'This transfer will be processed instantly and cannot be reversed.'
                            : 'This transfer will be processed within 5-10 minutes and cannot be reversed once completed.'}
                    </Text>
                </View>
            </View>
        </View>
    </View>
)

export default Transfer
