import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Linking } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import api from '@/services/api'

const CRYPTO_OPTIONS = [
    {
        value: 'bep20/usdt',
        label: 'USDT (BEP20)',
        network: 'Binance Smart Chain',
        icon: '💰',
    },
    {
        value: 'trc20/usdt',
        label: 'USDT (TRC20)',
        network: 'Tron Network',
        icon: '💰',
    },
]

const Deposit = () => {
    const router = useRouter()
    const params = useLocalSearchParams()

    // Accounts
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Form
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [depositAmount, setDepositAmount] = useState('')
    const [amountError, setAmountError] = useState('')
    const [selectedCrypto, setSelectedCrypto] = useState('bep20/usdt')
    const [showAccountPicker, setShowAccountPicker] = useState(false)
    const [showCryptoPicker, setShowCryptoPicker] = useState(false)

    // Payment
    const [paymentAddress, setPaymentAddress] = useState(null)
    const [qrCode, setQrCode] = useState(null)
    const [qrCodeUrl, setQrCodeUrl] = useState(null)
    const [depositId, setDepositId] = useState(null)
    const [transactionId, setTransactionId] = useState(null)

    // Processing
    const [isProcessing, setIsProcessing] = useState(false)
    const [depositStatus, setDepositStatus] = useState(null)
    const [copied, setCopied] = useState(false)

    // Verification
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationProgress, setVerificationProgress] = useState(0)
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [confirmations, setConfirmations] = useState(0)

    // UI
    const [showConfirmation, setShowConfirmation] = useState(false)

    useEffect(() => {
        fetchAccounts()
    }, [])

    // Handle pre-selected account from params
    useEffect(() => {
        if (accounts.length > 0 && params.account) {
            const account = accounts.find(acc => acc._id === params.account)
            if (account) {
                setSelectedAccount(account)
            }
        }
    }, [accounts, params.account])

    // Poll payment status
    useEffect(() => {
        if (!depositId || paymentReceived || depositStatus === 'success') {
            return
        }

        setIsVerifying(true)

        const initialTimeout = setTimeout(() => {
            checkPaymentStatus()
        }, 3000)

        const pollInterval = setInterval(async () => {
            const completed = await checkPaymentStatus()
            if (completed) {
                clearInterval(pollInterval)
                setIsVerifying(false)
            }
        }, 10000)

        return () => {
            clearTimeout(initialTimeout)
            clearInterval(pollInterval)
        }
    }, [depositId, paymentReceived, depositStatus])

    const fetchAccounts = async () => {
        setLoading(true)
        try {
            const response = await api.get('/account/my-accounts')

            if (response.data.success) {
                const realAccounts = response.data.data.filter(
                    acc => acc.accountType === 'Real'
                )
                setAccounts(realAccounts)
            }

            setError(null)
        } catch (err) {
            console.error('Error fetching accounts:', err)
            setError(err.response?.data?.message || 'Failed to load trading accounts')
            Alert.alert('Error', 'Failed to load trading accounts')
        } finally {
            setLoading(false)
        }
    }

    const checkPaymentStatus = async () => {
        try {
            const response = await api.get(`/transactions/deposits/${depositId}/status`)

            if (response.data.success) {
                const deposit = response.data.data

                if (deposit.blockBee?.confirmations !== undefined) {
                    setConfirmations(deposit.blockBee.confirmations)
                }

                if (deposit.status === 'completed') {
                    setPaymentReceived(true)
                    setIsVerifying(false)
                    setVerificationProgress(100)
                    setDepositStatus('success')
                    Alert.alert('Success', 'Payment received and confirmed! Your account has been credited.')
                    return true
                }

                if (deposit.blockBee?.confirmations > 0) {
                    const progress = Math.min((deposit.blockBee.confirmations / 1) * 100, 90)
                    setVerificationProgress(progress)
                }

                if (deposit.status === 'processing' && !paymentReceived) {
                    setDepositStatus('processing')
                }

                return false
            }
        } catch (error) {
            console.error('Payment status check error:', error)
            return false
        }
    }

    const validateAmount = (amount) => {
        const numAmount = parseFloat(amount)

        if (!amount || !amount.trim()) {
            return 'Amount is required'
        }

        if (isNaN(numAmount) || numAmount <= 0) {
            return 'Please enter a valid amount'
        }

        if (numAmount < 1) {
            return 'Minimum deposit: $1 USD'
        }

        if (numAmount > 100000) {
            return 'Maximum deposit: $100,000 USD'
        }

        return ''
    }

    const handleAmountChange = (value) => {
        setDepositAmount(value)
        if (selectedAccount) {
            const error = validateAmount(value)
            setAmountError(error)
        }
    }

    const handleContinueToConfirmation = () => {
        const error = validateAmount(depositAmount)
        if (error) {
            setAmountError(error)
            return
        }

        if (!selectedAccount) {
            setAmountError('Please select an account')
            return
        }

        setShowConfirmation(true)
    }

    const handleCreateDeposit = async () => {
        setIsProcessing(true)
        setDepositStatus('pending')

        try {
            const depositData = {
                tradingAccountId: selectedAccount._id,
                amount: parseFloat(depositAmount),
                ticker: selectedCrypto,
            }

            const response = await api.post('/transactions/deposits/blockbee/create', depositData)

            if (response.data.success) {
                setDepositStatus('success')
                setPaymentAddress(response.data.data.paymentAddress)
                setQrCode(response.data.data.qrCode)
                setQrCodeUrl(response.data.data.qrCodeUrl)
                setDepositId(response.data.data.depositId)
                setTransactionId(response.data.data.transactionId)
                Alert.alert('Success', 'Payment address created successfully!')
            } else {
                setDepositStatus('error')
                Alert.alert('Error', response.data.message)
            }
        } catch (error) {
            console.error('Deposit creation error:', error)
            setDepositStatus('error')
            Alert.alert('Error', error.response?.data?.message || 'Failed to create payment address')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCopyAddress = async () => {
        if (paymentAddress) {
            await Clipboard.setStringAsync(paymentAddress)
            setCopied(true)
            Alert.alert('Copied', 'Address copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const resetSelection = () => {
        setSelectedAccount(null)
        setDepositAmount('')
        setAmountError('')
        setDepositStatus(null)
        setShowConfirmation(false)
        setPaymentAddress(null)
        setQrCode(null)
        setQrCodeUrl(null)
        setDepositId(null)
        setTransactionId(null)
        setSelectedCrypto('bep20/usdt')
        setCopied(false)
        setIsVerifying(false)
        setVerificationProgress(0)
        setPaymentReceived(false)
        setConfirmations(0)
    }

    const getSelectedCryptoInfo = () => {
        return CRYPTO_OPTIONS.find(c => c.value === selectedCrypto)
    }

    const isFormValid = selectedAccount && depositAmount && !amountError

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading accounts...</Text>
            </View>
        )
    }

    if (error && accounts.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                        Error Loading Accounts
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">{error}</Text>
                    <TouchableOpacity
                        onPress={fetchAccounts}
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
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* SUCCESS SCREEN - Payment Address Generated */}
                    {depositStatus === 'success' && paymentAddress && !paymentReceived && (
                        <View className="px-6 py-6">
                            <View className="bg-white rounded-xl border border-gray-200 p-6">
                                <View className="items-center mb-6">
                                    <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="wallet" size={40} color="white" />
                                    </View>
                                    <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                        Payment Address Created!
                                    </Text>
                                    <Text className="text-gray-600 text-center">
                                        Send {getSelectedCryptoInfo()?.label} to the address below
                                    </Text>
                                </View>

                                {/* Verification Status */}
                                {isVerifying && (
                                    <View className="mb-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                        <View className="flex-row items-center justify-center mb-3">
                                            <ActivityIndicator size="small" color="#2563eb" />
                                            <Text className="text-blue-900 font-semibold ml-2">
                                                {confirmations === 0
                                                    ? 'Waiting for Payment...'
                                                    : confirmations >= 1
                                                        ? 'Processing Confirmation...'
                                                        : 'Verifying Payment...'}
                                            </Text>
                                        </View>

                                        {/* Progress Bar */}
                                        <View className="h-3 bg-blue-200 rounded-full overflow-hidden">
                                            <View
                                                className="h-full bg-blue-600"
                                                style={{ width: `${verificationProgress}%` }}
                                            />
                                        </View>

                                        <View className="flex-row items-center justify-between mt-3">
                                            <Text className="text-blue-700 text-xs">
                                                {confirmations === 0
                                                    ? 'Monitoring blockchain...'
                                                    : confirmations >= 1
                                                        ? 'Almost complete!'
                                                        : 'Checking confirmations...'}
                                            </Text>
                                            <Text className="text-blue-900 font-bold text-xs">
                                                {verificationProgress}%
                                            </Text>
                                        </View>

                                        {confirmations > 0 && (
                                            <View className="mt-3 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                                                <View className="flex-row items-center justify-center">
                                                    <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-2">
                                                        <Ionicons name="checkmark" size={14} color="white" />
                                                    </View>
                                                    <View>
                                                        <Text className="text-green-900 font-bold text-sm">
                                                            Payment Detected! 🎉
                                                        </Text>
                                                        <Text className="text-green-700 text-xs">
                                                            {confirmations} confirmation{confirmations > 1 ? 's' : ''} received
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* QR Code */}
                                <View className="items-center mb-6">
                                    <View className="bg-white p-4 rounded-xl border-2 border-gray-200">
                                        <Image
                                            source={{
                                                uri: qrCode
                                                    ? `data:image/png;base64,${qrCode}`
                                                    : qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentAddress)}`
                                            }}
                                            style={{ width: 200, height: 200 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-xs text-gray-600 mt-3 text-center">
                                        Scan this QR code with your crypto wallet
                                    </Text>
                                </View>

                                {/* Payment Address */}
                                <View className="mb-6">
                                    <View className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                        <Text className="text-xs text-blue-600 font-medium mb-2">
                                            {getSelectedCryptoInfo()?.label} Payment Address
                                        </Text>
                                        <View className="bg-white rounded-lg p-3 mb-3">
                                            <Text className="font-mono text-xs text-gray-900" selectable>
                                                {paymentAddress}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={handleCopyAddress}
                                            className="bg-blue-600 py-3 rounded-lg"
                                            activeOpacity={0.7}
                                        >
                                            <View className="flex-row items-center justify-center">
                                                <Ionicons
                                                    name={copied ? 'checkmark' : 'copy-outline'}
                                                    size={18}
                                                    color="white"
                                                />
                                                <Text className="text-white font-semibold ml-2">
                                                    {copied ? 'Copied!' : 'Copy Address'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Amount Info */}
                                <View className="mb-6">
                                    <View className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                                        <Text className="text-xs text-green-600 font-medium mb-1">
                                            Amount to Send
                                        </Text>
                                        <Text className="text-3xl font-bold text-green-900 mb-1">
                                            ${depositAmount} USD
                                        </Text>
                                        <Text className="text-xs text-green-700">
                                            (Equivalent in {getSelectedCryptoInfo()?.label})
                                        </Text>
                                    </View>
                                </View>

                                {/* Details Grid */}
                                <View style={{ gap: 8 }} className="mb-6">
                                    <View className="flex-row gap-2">
                                        <View className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <Text className="text-xs text-gray-600 mb-1">Account</Text>
                                            <Text className="text-sm font-medium text-gray-900">
                                                {selectedAccount?.accountNumber}
                                            </Text>
                                        </View>
                                        <View className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <Text className="text-xs text-gray-600 mb-1">Platform</Text>
                                            <Text className="text-sm font-medium text-gray-900">
                                                {selectedAccount?.platform}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <View className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <Text className="text-xs text-gray-600 mb-1">Network</Text>
                                            <Text className="text-sm font-medium text-gray-900">
                                                {getSelectedCryptoInfo()?.network}
                                            </Text>
                                        </View>
                                        <View className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <Text className="text-xs text-gray-600 mb-1">Status</Text>
                                            <View className="flex-row items-center">
                                                <ActivityIndicator size="small" color="#f59e0b" />
                                                <Text className="text-sm font-medium text-amber-600 ml-1">
                                                    Awaiting
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={{ gap: 12 }}>
                                    <TouchableOpacity
                                        onPress={() => router.push('/transactions')}
                                        className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-900 font-semibold text-center">
                                            View Transaction History
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={resetSelection}
                                        className="bg-gray-100 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-700 font-semibold text-center">
                                            Make Another Deposit
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Instructions */}
                                <View className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                    <View className="flex-row items-start">
                                        <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3 mt-0.5">
                                            <Ionicons name="information" size={16} color="white" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="font-semibold text-blue-900 mb-2">
                                                Important Instructions:
                                            </Text>
                                            <View style={{ gap: 8 }}>
                                                <Text className="text-xs text-blue-800">
                                                    1. Send the exact amount to the payment address above
                                                </Text>
                                                <Text className="text-xs text-blue-800">
                                                    2. Verify you're sending on <Text className="font-bold">{getSelectedCryptoInfo()?.network}</Text>
                                                </Text>
                                                <Text className="text-xs text-blue-800">
                                                    3. Auto-credit after 1 blockchain confirmation
                                                </Text>
                                                <Text className="text-xs text-blue-800">
                                                    4. Processing: Usually 5-30 minutes
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* PAYMENT RECEIVED - Success */}
                    {paymentReceived && (
                        <View className="px-6 py-6">
                            <View className="bg-white rounded-xl border border-gray-200 p-6">
                                <View className="items-center mb-6">
                                    <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="checkmark-circle" size={60} color="white" />
                                    </View>
                                    <Text className="text-3xl font-bold text-green-900 mb-2 text-center">
                                        Payment Confirmed!
                                    </Text>
                                    <Text className="text-green-700 text-center mb-3">
                                        Your deposit has been successfully processed
                                    </Text>
                                    <View className="px-4 py-2 bg-green-100 border-2 border-green-300 rounded-full">
                                        <Text className="text-green-800 font-semibold text-xs">
                                            ✓ {confirmations} Blockchain Confirmation{confirmations > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                </View>

                                {/* Amount Credited */}
                                <View className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
                                    <Text className="text-xs text-green-600 font-medium text-center mb-2">
                                        Amount Credited
                                    </Text>
                                    <Text className="text-4xl font-bold text-green-900 text-center mb-2">
                                        ${depositAmount} <Text className="text-2xl">USD</Text>
                                    </Text>
                                    <View className="bg-green-100 px-4 py-2 rounded-full self-center">
                                        <Text className="text-xs text-green-700 text-center">
                                            ✓ Deposited to {selectedAccount?.accountNumber}
                                        </Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={{ gap: 12 }}>
                                    <TouchableOpacity
                                        onPress={() => router.push('/transactions')}
                                        className="bg-blue-600 py-4 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center justify-center">
                                            <Ionicons name="checkmark-circle" size={20} color="white" />
                                            <Text className="text-white font-semibold ml-2 text-base">
                                                View Transaction History
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={resetSelection}
                                        className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-900 font-semibold text-center">
                                            Make Another Deposit
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ERROR STATE */}
                    {depositStatus === 'error' && (
                        <View className="px-6 py-6">
                            <View className="bg-white rounded-xl border border-gray-200 p-6">
                                <View className="items-center">
                                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="close-circle" size={40} color="#dc2626" />
                                    </View>
                                    <Text className="text-xl font-bold text-red-900 mb-2 text-center">
                                        Failed to Create Payment Address
                                    </Text>
                                    <Text className="text-gray-600 text-center mb-6">
                                        An error occurred while creating your payment address
                                    </Text>

                                    <View style={{ gap: 12 }} className="w-full">
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmation(false)}
                                            className="bg-orange-500 py-4 rounded-lg"
                                            activeOpacity={0.7}
                                        >
                                            <View className="flex-row items-center justify-center">
                                                <Ionicons name="refresh" size={18} color="white" />
                                                <Text className="text-white font-semibold ml-2">
                                                    Try Again
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={resetSelection}
                                            className="bg-white border-2 border-gray-300 py-3 rounded-lg"
                                            activeOpacity={0.7}
                                        >
                                            <Text className="text-gray-900 font-semibold text-center">
                                                Start Over
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* MAIN FORM */}
                    {!depositStatus && (
                        <>
                            {!showConfirmation ? (
                                <View className="px-6 py-6">
                                    {/* Info Banner */}
                                    <View className="bg-orange-500 rounded-xl p-6 mb-6">
                                        <View className="flex-row items-start">
                                            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                                                <Ionicons name="flash" size={24} color="white" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-lg mb-2">
                                                    Cryptocurrency Deposits
                                                </Text>
                                                <View style={{ gap: 4 }}>
                                                    <Text className="text-white text-xs opacity-90">
                                                        ✓ Direct wallet-to-wallet payment
                                                    </Text>
                                                    <Text className="text-white text-xs opacity-90">
                                                        ✓ Automatic confirmation & instant credit
                                                    </Text>
                                                    <Text className="text-white text-xs opacity-90">
                                                        ✓ Secure blockchain transactions
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* No Accounts */}
                                    {accounts.length === 0 ? (
                                        <View className="bg-white rounded-xl border border-gray-200 p-12 items-center">
                                            <Ionicons name="alert-circle-outline" size={64} color="#9ca3af" />
                                            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2 text-center">
                                                No Trading Accounts Found
                                            </Text>
                                            <Text className="text-gray-600 text-center mb-6">
                                                You need a trading account to make deposits
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => router.push('/new-account')}
                                                className="bg-orange-500 px-6 py-3 rounded-lg"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-white font-semibold">
                                                    Create Trading Account
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <>
                                            {/* Account Selection */}
                                            <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                                                <View className="flex-row items-center mb-4">
                                                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                                        <Ionicons name="wallet" size={20} color="#2563eb" />
                                                    </View>
                                                    <Text className="text-lg font-bold text-gray-900">
                                                        Select Trading Account
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => setShowAccountPicker(!showAccountPicker)}
                                                    className={`px-4 py-4 border-2 rounded-lg flex-row items-center justify-between ${selectedAccount ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                                                        }`}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text className={`text-sm ${selectedAccount ? 'text-green-900' : 'text-gray-500'}`}>
                                                        {selectedAccount
                                                            ? `${selectedAccount.accountNumber} - ${selectedAccount.platform} (${selectedAccount.accountType})`
                                                            : 'Choose account to deposit to'}
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
                                                                    setDepositAmount('')
                                                                    setAmountError('')
                                                                }}
                                                                className={`px-4 py-3 ${index < accounts.length - 1 ? 'border-b border-gray-100' : ''} ${selectedAccount?._id === account._id ? 'bg-green-50' : 'bg-white'
                                                                    }`}
                                                                activeOpacity={0.7}
                                                            >
                                                                <Text className={`text-sm ${selectedAccount?._id === account._id ? 'text-green-900 font-semibold' : 'text-gray-900'}`}>
                                                                    {account.accountNumber} - {account.platform} ({account.accountType})
                                                                </Text>
                                                                <Text className="text-xs text-gray-600 mt-0.5">
                                                                    Balance: ${account.balance} {account.currency}
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
                                                                Account Selected
                                                            </Text>
                                                        </View>
                                                        <Text className="text-xs text-green-700 mt-1">
                                                            Funds will be deposited to: {selectedAccount.accountNumber} ({selectedAccount.platform})
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Crypto Selection */}
                                            {selectedAccount && (
                                                <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                                                    <View className="flex-row items-center mb-4">
                                                        <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                                                            <Text className="text-xl">₿</Text>
                                                        </View>
                                                        <Text className="text-lg font-bold text-gray-900">
                                                            Choose Cryptocurrency
                                                        </Text>
                                                    </View>

                                                    <View style={{ gap: 12 }}>
                                                        {CRYPTO_OPTIONS.map((crypto) => (
                                                            <TouchableOpacity
                                                                key={crypto.value}
                                                                onPress={() => setSelectedCrypto(crypto.value)}
                                                                className={`p-4 border-2 rounded-lg ${selectedCrypto === crypto.value
                                                                        ? 'border-blue-600 bg-blue-50'
                                                                        : 'border-gray-200 bg-white'
                                                                    }`}
                                                                activeOpacity={0.7}
                                                            >
                                                                <View className="flex-row items-center">
                                                                    <Text className="text-2xl mr-3">{crypto.icon}</Text>
                                                                    <View className="flex-1">
                                                                        <Text className="font-semibold text-gray-900">{crypto.label}</Text>
                                                                        <Text className="text-xs text-gray-600">{crypto.network}</Text>
                                                                    </View>
                                                                    {selectedCrypto === crypto.value && (
                                                                        <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
                                                                    )}
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </View>
                                            )}

                                            {/* Amount Input */}
                                            {selectedAccount && (
                                                <View className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                                                    <View className="flex-row items-center mb-4">
                                                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                                                            <Ionicons name="cash" size={20} color="#15803d" />
                                                        </View>
                                                        <Text className="text-lg font-bold text-gray-900">
                                                            Enter Amount
                                                        </Text>
                                                    </View>

                                                    <View className="relative mb-3">
                                                        <View style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}>
                                                            <Text className="text-gray-500 text-2xl">$</Text>
                                                        </View>
                                                        <TextInput
                                                            placeholder="0.00"
                                                            value={depositAmount}
                                                            onChangeText={handleAmountChange}
                                                            keyboardType="numeric"
                                                            className={`pl-12 pr-20 py-4 text-2xl font-semibold border-2 rounded-lg ${amountError
                                                                    ? 'border-red-300 bg-red-50'
                                                                    : depositAmount && !amountError
                                                                        ? 'border-green-300 bg-green-50'
                                                                        : 'border-gray-300'
                                                                }`}
                                                        />
                                                        <View style={{ position: 'absolute', right: 16, top: 16 }}>
                                                            <Text className="text-gray-500 text-xl font-medium">USD</Text>
                                                        </View>
                                                    </View>

                                                    {amountError && (
                                                        <View className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                            <View className="flex-row items-center">
                                                                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                                                                <Text className="text-red-700 text-xs font-medium ml-2">
                                                                    {amountError}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )}

                                                    <View className="flex-row items-center justify-between">
                                                        <Text className="text-xs text-gray-600">Minimum: $1 USD</Text>
                                                        <Text className="text-xs text-gray-600">Maximum: $100,000 USD</Text>
                                                    </View>

                                                    {depositAmount && !amountError && (
                                                        <View className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <View className="flex-row items-start">
                                                                <Ionicons name="information-circle" size={16} color="#2563eb" />
                                                                <View className="flex-1 ml-2">
                                                                    <Text className="text-blue-800 text-xs font-medium mb-1">
                                                                        You'll send {getSelectedCryptoInfo()?.label}
                                                                    </Text>
                                                                    <Text className="text-blue-700 text-xs">
                                                                        The exact crypto amount will be calculated based on current market rates
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            )}

                                            {/* Continue Button */}
                                            {selectedAccount && (
                                                <View className="bg-white rounded-xl border border-gray-200 p-6">
                                                    <TouchableOpacity
                                                        onPress={handleContinueToConfirmation}
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
                                        </>
                                    )}
                                </View>
                            ) : (
                                // CONFIRMATION SCREEN
                                <View className="px-6 py-6">
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmation(false)}
                                        disabled={isProcessing}
                                        className="flex-row items-center mb-6"
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="arrow-back" size={20} color="#374151" />
                                        <Text className="text-gray-700 ml-2">Back to form</Text>
                                    </TouchableOpacity>

                                    <View className="bg-white rounded-xl border border-gray-200 p-6">
                                        <View className="items-center mb-6">
                                            <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4">
                                                <Ionicons name="flash" size={32} color="white" />
                                            </View>
                                            <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                                Confirm Your Deposit
                                            </Text>
                                            <Text className="text-gray-600 text-center">
                                                Review details before generating payment address
                                            </Text>
                                        </View>

                                        {/* Amount */}
                                        <View className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
                                            <Text className="text-xs text-blue-600 font-medium mb-1 text-center">
                                                Deposit Amount
                                            </Text>
                                            <Text className="text-4xl font-bold text-blue-900 text-center">
                                                ${depositAmount} USD
                                            </Text>
                                        </View>

                                        {/* Details Grid */}
                                        <View style={{ gap: 8 }} className="mb-6">
                                            <View className="flex-row gap-2">
                                                <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                    <Text className="text-xs text-gray-600 mb-1">Trading Account</Text>
                                                    <Text className="font-semibold text-gray-900 text-sm">
                                                        {selectedAccount.accountNumber}
                                                    </Text>
                                                    <Text className="text-xs text-gray-600 mt-1">
                                                        {selectedAccount.platform}
                                                    </Text>
                                                </View>
                                                <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                    <Text className="text-xs text-gray-600 mb-1">Account Type</Text>
                                                    <Text className="font-semibold text-gray-900 text-sm">
                                                        {selectedAccount.accountType}
                                                    </Text>
                                                    <Text className="text-xs text-gray-600 mt-1">
                                                        Current: ${selectedAccount.balance}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <Text className="text-xs text-gray-600 mb-1">Cryptocurrency</Text>
                                                <Text className="font-semibold text-gray-900 text-sm">
                                                    {getSelectedCryptoInfo()?.label}
                                                </Text>
                                                <Text className="text-xs text-gray-600 mt-1">
                                                    {getSelectedCryptoInfo()?.network}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Actions */}
                                        <View style={{ gap: 12 }}>
                                            <TouchableOpacity
                                                onPress={handleCreateDeposit}
                                                disabled={isProcessing}
                                                className={`py-4 rounded-lg ${isProcessing ? 'bg-gray-300' : 'bg-blue-600'}`}
                                                activeOpacity={0.7}
                                            >
                                                {isProcessing ? (
                                                    <View className="flex-row items-center justify-center">
                                                        <ActivityIndicator size="small" color="#ffffff" />
                                                        <Text className="text-white font-semibold ml-2">
                                                            Generating Address...
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <View className="flex-row items-center justify-center">
                                                        <Ionicons name="flash" size={18} color="white" />
                                                        <Text className="text-white font-semibold ml-2 text-base">
                                                            Generate Payment Address
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

                                        {/* Note */}
                                        <View className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <View className="flex-row items-start">
                                                <Ionicons name="alert-circle" size={18} color="#d97706" />
                                                <Text className="text-xs text-amber-800 ml-2 flex-1">
                                                    <Text className="font-bold">Note:</Text> After clicking "Generate Payment Address", you'll receive a unique crypto wallet address and QR code. Send your payment to that address to complete the deposit.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Deposit
