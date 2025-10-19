import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl, Modal, Share } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import api from '@/services/api'

const ReferEarn = () => {
    const router = useRouter()

    // Data
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [referralData, setReferralData] = useState(null)
    const [referrals, setReferrals] = useState([])
    const [commissionRate, setCommissionRate] = useState(0.01)
    const [withdrawalHistory, setWithdrawalHistory] = useState([])

    // UI
    const [copiedLink, setCopiedLink] = useState(false)
    const [copiedCode, setCopiedCode] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [userTrades, setUserTrades] = useState([])
    const [loadingTrades, setLoadingTrades] = useState(false)

    // Withdrawal Modal
    const [showPayoutModal, setShowPayoutModal] = useState(false)
    const [payoutAmount, setPayoutAmount] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [selectedNetwork, setSelectedNetwork] = useState('TRC20')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        await Promise.all([
            fetchReferralData(),
            fetchReferrals(),
            fetchWithdrawalHistory(),
        ])
    }

    const fetchReferralData = async () => {
        try {
            const response = await api.get('/refer/my-referral')
            if (response.data.success) {
                setReferralData(response.data.data)
            }
        } catch (error) {
            console.error('Failed to load referral data:', error)
            Alert.alert('Error', 'Failed to load referral data')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const fetchReferrals = async () => {
        try {
            const response = await api.get('/refer/my-referrals')
            if (response.data.success) {
                setReferrals(response.data.data.referrals)
                setCommissionRate(response.data.data.commissionRate || 0.01)
            }
        } catch (error) {
            console.error('Failed to load referrals:', error)
        }
    }

    const fetchWithdrawalHistory = async () => {
        try {
            const response = await api.get('/refer/commission-withdrawals')
            if (response.data.success) {
                setWithdrawalHistory(response.data.data)
            }
        } catch (error) {
            console.error('Failed to load withdrawal history:', error)
        }
    }

    const fetchUserTrades = async (userId) => {
        if (selectedUser === userId) {
            setSelectedUser(null)
            setUserTrades([])
            return
        }

        setLoadingTrades(true)
        try {
            const response = await api.get(`/refer/referral/${userId}/trades`)
            if (response.data.success) {
                setUserTrades(response.data.data.trades)
                setSelectedUser(userId)
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load trades')
            setUserTrades([])
        } finally {
            setLoadingTrades(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchAllData()
    }, [])

    const handleCopyLink = async () => {
        await Clipboard.setStringAsync(referralData.referralLink)
        setCopiedLink(true)
        Alert.alert('Copied', 'Referral link copied to clipboard!')
        setTimeout(() => setCopiedLink(false), 2000)
    }

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(referralData.referralCode)
        setCopiedCode(true)
        Alert.alert('Copied', 'Referral code copied to clipboard!')
        setTimeout(() => setCopiedCode(false), 2000)
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join this trading platform using my referral link: ${referralData.referralLink}`,
                title: 'Join Trading Platform',
            })
        } catch (error) {
            console.error('Share error:', error)
        }
    }

    const handlePayoutSubmit = async () => {
        if (!payoutAmount || !walletAddress) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }

        const amount = parseFloat(payoutAmount)
        if (amount <= 0 || amount > (referralData?.totalEarnings || 0)) {
            Alert.alert('Error', 'Invalid amount')
            return
        }

        if (selectedNetwork === 'TRC20' && !walletAddress.startsWith('T')) {
            Alert.alert('Error', 'Invalid TRC20 wallet address')
            return
        }

        setIsProcessing(true)
        try {
            const response = await api.post('/refer/withdraw-commission', {
                amount,
                walletAddress,
                currency: 'USDT',
                network: selectedNetwork,
            })

            if (response.data.success) {
                Alert.alert('Success', 'Withdrawal request submitted successfully!')
                setShowPayoutModal(false)
                setPayoutAmount('')
                setWalletAddress('')
                fetchAllData()
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Withdrawal failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading referral data...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#f97316']}
                        tintColor="#f97316"
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View className="px-6 py-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Refer & Earn</Text>
                        <Text className="text-gray-600">
                            Earn {(commissionRate * 100).toFixed(3)}% commission on trades
                        </Text>
                    </View>

                    {/* Stats Cards */}
                    <View className="flex-row flex-wrap gap-3 mb-6">
                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border-l-4 border-blue-500">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Total Referrals</Text>
                                <Ionicons name="people" size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900">
                                {referralData?.totalReferrals || 0}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border-l-4 border-green-500">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Available Balance</Text>
                                <Ionicons name="cash" size={20} color="#22c55e" />
                            </View>
                            <Text className="text-2xl font-bold text-green-600">
                                ${referralData?.totalEarnings?.toFixed(2) || '0.00'}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border-l-4 border-orange-500">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Total Volume</Text>
                                <Ionicons name="trending-up" size={20} color="#f97316" />
                            </View>
                            <Text className="text-2xl font-bold text-orange-600">
                                ${referralData?.totalVolume?.toFixed(2) || '0.00'}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border-l-4 border-purple-500">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Commission Rate</Text>
                                <Ionicons name="wallet" size={20} color="#a855f7" />
                            </View>
                            <Text className="text-2xl font-bold text-purple-600">
                                {(commissionRate * 100).toFixed(3)}%
                            </Text>
                        </View>
                    </View>

                    {/* Referral Details Card */}
                    <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-bold text-gray-900">Referral Details</Text>
                            <TouchableOpacity
                                onPress={() => setShowPayoutModal(true)}
                                disabled={(referralData?.totalEarnings || 0) < 10}
                                className={`flex-row items-center px-4 py-2 rounded-lg ${(referralData?.totalEarnings || 0) < 10
                                        ? 'bg-gray-300'
                                        : 'bg-green-600'
                                    }`}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="wallet" size={16} color="white" />
                                <Text className="text-white font-semibold ml-2 text-sm">Withdraw</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: 12 }} className="mb-4">
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-2">Referral Code</Text>
                                <View className="flex-row gap-2">
                                    <View className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                        <Text className="font-mono text-gray-900">{referralData?.referralCode}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleCopyCode}
                                        className="bg-white border border-gray-300 px-4 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name={copiedCode ? 'checkmark' : 'copy-outline'} size={20} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-2">Referral Link</Text>
                                <View className="flex-row gap-2">
                                    <View className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                        <Text className="text-sm text-gray-900" numberOfLines={1}>{referralData?.referralLink}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleCopyLink}
                                        className="bg-white border border-gray-300 px-4 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name={copiedLink ? 'checkmark' : 'copy-outline'} size={20} color="#374151" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleShare}
                                        className="bg-orange-500 px-4 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="share-social" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <Text className="text-sm text-blue-800">
                                <Text className="font-bold">How it works:</Text> Share your link with friends. When they register and trade, you earn {(commissionRate * 100).toFixed(3)}% commission on their trade volume. Minimum withdrawal: $10. Admin processes withdrawals within 24 hours.
                            </Text>
                        </View>
                    </View>

                    {/* Withdrawal History */}
                    {withdrawalHistory.length > 0 && (
                        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="time" size={20} color="#374151" />
                                <Text className="text-lg font-bold text-gray-900 ml-2">Withdrawal History</Text>
                            </View>
                            <View style={{ gap: 12 }}>
                                {withdrawalHistory.map((w) => (
                                    <View key={w._id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                        <View className="flex-row items-start justify-between mb-2">
                                            <View className="flex-1">
                                                <Text className="font-bold text-gray-900 mb-1">
                                                    ${w.amount.toFixed(2)} {w.currency}
                                                </Text>
                                                <Text className="text-xs text-gray-600 font-mono mb-1">{w.transactionId}</Text>
                                                <Text className="text-xs text-gray-500">
                                                    {new Date(w.createdAt).toLocaleString()}
                                                </Text>
                                                {w.withdrawalDetails?.walletAddress && (
                                                    <Text className="text-xs text-gray-600 font-mono mt-1">
                                                        To: {w.withdrawalDetails.walletAddress.slice(0, 10)}...{w.withdrawalDetails.walletAddress.slice(-6)}
                                                    </Text>
                                                )}
                                            </View>
                                            <View className={`px-3 py-1 rounded-full border ${getStatusColor(w.status)}`}>
                                                <Text className="text-xs font-semibold">
                                                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Referrals List */}
                    <View className="bg-white rounded-xl border border-gray-200 p-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            My Referrals ({referrals.length})
                        </Text>

                        {referrals.length === 0 ? (
                            <View className="items-center py-12">
                                <Ionicons name="people-outline" size={64} color="#d1d5db" />
                                <Text className="text-gray-600 font-medium mt-4">No referrals yet</Text>
                                <Text className="text-sm text-gray-500 mt-2 text-center">
                                    Start sharing your referral link to earn commissions!
                                </Text>
                            </View>
                        ) : (
                            <View style={{ gap: 12 }}>
                                {referrals.map((referral) => (
                                    <View key={referral.id} className="border border-gray-200 rounded-lg p-4">
                                        <View className="flex-row items-start justify-between mb-3">
                                            <View className="flex-1">
                                                <Text className="font-bold text-gray-900 mb-1">{referral.name}</Text>
                                                <View className="flex-row items-center">
                                                    <Ionicons name="mail" size={12} color="#6b7280" />
                                                    <Text className="text-sm text-gray-600 ml-1">{referral.email}</Text>
                                                </View>
                                                <View className="flex-row items-center mt-1">
                                                    <Ionicons name="calendar" size={10} color="#6b7280" />
                                                    <Text className="text-xs text-gray-500 ml-1">
                                                        {new Date(referral.joinedAt).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                                <Text className="text-xs text-green-700 font-medium">Commission</Text>
                                                <Text className="text-lg font-bold text-green-600">
                                                    ${referral.stats.myCommission.toFixed(4)}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row gap-2 mb-3">
                                            <View className="flex-1 bg-gray-50 p-2 rounded-lg items-center">
                                                <Text className="text-xs text-gray-600">Accounts</Text>
                                                <Text className="font-bold text-gray-900">{referral.stats.totalAccounts}</Text>
                                            </View>
                                            <View className="flex-1 bg-gray-50 p-2 rounded-lg items-center">
                                                <Text className="text-xs text-gray-600">Trades</Text>
                                                <Text className="font-bold text-gray-900">{referral.stats.totalTrades}</Text>
                                            </View>
                                            <View className="flex-1 bg-gray-50 p-2 rounded-lg items-center">
                                                <Text className="text-xs text-gray-600">Volume</Text>
                                                <Text className="font-bold text-gray-900 text-sm">
                                                    ${referral.stats.totalTradeAmount.toFixed(0)}
                                                </Text>
                                            </View>
                                            <View className="flex-1 bg-gray-50 p-2 rounded-lg items-center">
                                                <Text className="text-xs text-gray-600">P/L</Text>
                                                <Text className={`font-bold text-sm ${referral.stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    ${referral.stats.totalProfitLoss.toFixed(0)}
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => fetchUserTrades(referral.id)}
                                            disabled={loadingTrades}
                                            className="bg-white border border-gray-300 py-2 rounded-lg"
                                            activeOpacity={0.7}
                                        >
                                            {loadingTrades && selectedUser === referral.id ? (
                                                <View className="flex-row items-center justify-center">
                                                    <ActivityIndicator size="small" color="#f97316" />
                                                    <Text className="text-gray-700 ml-2 text-sm">Loading...</Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center justify-center">
                                                    <Text className="text-gray-700 text-sm font-medium">
                                                        {selectedUser === referral.id ? 'Hide Trades' : 'View Trades'}
                                                    </Text>
                                                    <Ionicons
                                                        name={selectedUser === referral.id ? 'chevron-up' : 'chevron-down'}
                                                        size={14}
                                                        color="#374151"
                                                        style={{ marginLeft: 4 }}
                                                    />
                                                </View>
                                            )}
                                        </TouchableOpacity>

                                        {selectedUser === referral.id && userTrades.length > 0 && (
                                            <View className="mt-3 pt-3 border-t border-gray-200">
                                                <View className="flex-row items-center mb-2">
                                                    <Ionicons name="pulse" size={14} color="#374151" />
                                                    <Text className="text-sm font-medium text-gray-700 ml-1">
                                                        Recent Trades ({userTrades.length})
                                                    </Text>
                                                </View>
                                                <ScrollView style={{ maxHeight: 200 }}>
                                                    <View style={{ gap: 8 }}>
                                                        {userTrades.map((trade) => (
                                                            <View key={trade.id} className="bg-gray-50 p-3 rounded-lg">
                                                                <View className="flex-row items-start justify-between">
                                                                    <View className="flex-1">
                                                                        <Text className="font-medium text-xs text-gray-900">
                                                                            {trade.symbol} • {trade.type} • {trade.volume} lots
                                                                        </Text>
                                                                        <Text className="text-xs text-gray-600 mt-0.5">
                                                                            {trade.openPrice} → {trade.closePrice}
                                                                        </Text>
                                                                        <Text className="text-xs text-gray-500 mt-1">
                                                                            {new Date(trade.closeTime).toLocaleString()}
                                                                        </Text>
                                                                    </View>
                                                                    <View className="items-end">
                                                                        <Text className={`font-bold text-xs ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                                                            }`}>
                                                                            ${trade.profitLoss.toFixed(2)}
                                                                        </Text>
                                                                        <Text className="text-green-600 text-xs mt-1">
                                                                            +${trade.myCommission.toFixed(4)}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </ScrollView>
                                            </View>
                                        )}

                                        {selectedUser === referral.id && userTrades.length === 0 && !loadingTrades && (
                                            <Text className="text-center text-gray-500 text-sm mt-3 py-2">
                                                No trades yet
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Withdrawal Modal */}
            <Modal
                visible={showPayoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPayoutModal(false)}
            >
                <View className="flex-1 bg-black/50 items-center justify-center p-4">
                    <View className="bg-white rounded-xl p-6 w-full max-w-md">
                        <Text className="text-xl font-bold mb-4">Withdraw Commission</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 16 }}>
                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Available Balance</Text>
                                    <Text className="text-3xl font-bold text-green-600 mb-1">
                                        ${referralData?.totalEarnings?.toFixed(2) || '0.00'}
                                    </Text>
                                    <Text className="text-xs text-gray-500">USDT equivalent</Text>
                                </View>

                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Withdrawal Amount (USD)</Text>
                                    <TextInput
                                        placeholder="Min: $10"
                                        value={payoutAmount}
                                        onChangeText={setPayoutAmount}
                                        keyboardType="numeric"
                                        className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    />
                                    <Text className="text-xs text-gray-500 mt-1">Minimum withdrawal: $10</Text>
                                </View>

                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Network</Text>
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity
                                            onPress={() => setSelectedNetwork('TRC20')}
                                            className={`flex-1 px-4 py-3 border-2 rounded-lg ${selectedNetwork === 'TRC20' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                                                }`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-center font-medium ${selectedNetwork === 'TRC20' ? 'text-orange-600' : 'text-gray-700'
                                                }`}>
                                                TRC20
                                            </Text>
                                            <Text className="text-xs text-gray-500 text-center mt-1">Low Fee</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setSelectedNetwork('ERC20')}
                                            className={`flex-1 px-4 py-3 border-2 rounded-lg ${selectedNetwork === 'ERC20' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                                                }`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-center font-medium ${selectedNetwork === 'ERC20' ? 'text-orange-600' : 'text-gray-700'
                                                }`}>
                                                ERC20
                                            </Text>
                                            <Text className="text-xs text-gray-500 text-center mt-1">Higher Fee</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Wallet Address ({selectedNetwork})
                                    </Text>
                                    <TextInput
                                        placeholder={selectedNetwork === 'TRC20' ? 'T... (starts with T)' : '0x... (starts with 0x)'}
                                        value={walletAddress}
                                        onChangeText={setWalletAddress}
                                        className="px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm text-gray-900"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex-row">
                                    <Ionicons name="alert-circle" size={18} color="#ca8a04" style={{ marginRight: 8 }} />
                                    <View className="flex-1">
                                        <Text className="text-xs text-yellow-800 font-medium mb-1">Important:</Text>
                                        <Text className="text-xs text-yellow-700">
                                            Admin will manually process your withdrawal within 24 hours. Please ensure your wallet address is correct.
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row gap-3 pt-2">
                                    <TouchableOpacity
                                        onPress={handlePayoutSubmit}
                                        disabled={isProcessing}
                                        className={`flex-1 py-3 rounded-lg ${isProcessing ? 'bg-gray-300' : 'bg-green-600'}`}
                                        activeOpacity={0.7}
                                    >
                                        {isProcessing ? (
                                            <View className="flex-row items-center justify-center">
                                                <ActivityIndicator size="small" color="white" />
                                                <Text className="text-white font-semibold ml-2">Processing...</Text>
                                            </View>
                                        ) : (
                                            <Text className="text-white font-semibold text-center">Submit Withdrawal</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setShowPayoutModal(false)}
                                        disabled={isProcessing}
                                        className="bg-white border-2 border-gray-300 px-6 py-3 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-700 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default ReferEarn
