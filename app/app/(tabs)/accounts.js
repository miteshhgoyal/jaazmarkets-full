import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useAuth } from '@/context/authContext'
import api from '@/services/api'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'

const Accounts = () => {
    const router = useRouter()
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState('Real')
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await api.get('/account/my-accounts')

            if (response.data.success) {
                setAccounts(response.data.data)
            }
        } catch (err) {
            console.error('Failed to fetch accounts:', err)
            setError(err.response?.data?.message || 'Failed to load accounts')
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await fetchAccounts()
        setRefreshing(false)
    }, [])

    const getFilteredAccounts = () => {
        let filtered = accounts

        // Filter by tab
        filtered = filtered.filter((acc) => {
            if (activeTab === 'Real') return acc.accountType === 'Real' && acc.status !== 'closed'
            if (activeTab === 'Demo') return acc.accountType === 'Demo' && acc.status !== 'closed'
            if (activeTab === 'Archived') return acc.status === 'closed'
            return true
        })

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (acc) =>
                    acc.accountNumber?.toLowerCase().includes(searchLower) ||
                    acc.login?.toLowerCase().includes(searchLower) ||
                    acc.platform?.toLowerCase().includes(searchLower) ||
                    acc.accountClass?.toLowerCase().includes(searchLower)
            )
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case 'balance-high':
                    return (b.balance || 0) - (a.balance || 0)
                case 'balance-low':
                    return (a.balance || 0) - (b.balance || 0)
                default:
                    return 0
            }
        })

        return filtered
    }

    const filteredAccounts = getFilteredAccounts()

    // Count accounts by type
    const realCount = accounts.filter((acc) => acc.accountType === 'Real' && acc.status !== 'closed').length
    const demoCount = accounts.filter((acc) => acc.accountType === 'Demo' && acc.status !== 'closed').length
    const archivedCount = accounts.filter((acc) => acc.status === 'closed').length

    const handleCopyToClipboard = async (text, label) => {
        await Clipboard.setStringAsync(text)
        Alert.alert('Copied', `${label} copied to clipboard`)
    }

    const handleReactivate = async (accountId) => {
        Alert.alert(
            'Reactivate Account',
            'Are you sure you want to reactivate this account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reactivate',
                    onPress: async () => {
                        try {
                            const response = await api.patch(`/account/${accountId}/status`, { status: 'active' })
                            if (response.data.success) {
                                Alert.alert('Success', 'Account reactivated successfully')
                                fetchAccounts()
                            }
                        } catch (err) {
                            Alert.alert('Error', err.response?.data?.message || 'Failed to reactivate account')
                        }
                    }
                }
            ]
        )
    }

    const renderAccountCard = (account) => {
        const isArchived = account.status === 'closed'

        return (
            <View key={account._id} className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                {/* Header with badges */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                    <View className={`px-2.5 py-1 rounded-full ${account.accountType === 'Real' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        <Text className={`text-xs font-semibold ${account.accountType === 'Real' ? 'text-purple-800' : 'text-blue-800'}`}>
                            {account.accountType}
                        </Text>
                    </View>
                    <View className="px-2.5 py-1 rounded-full bg-gray-100">
                        <Text className="text-xs font-semibold text-gray-800">{account.platform}</Text>
                    </View>
                    <View className="px-2.5 py-1 rounded-full bg-orange-100">
                        <Text className="text-xs font-semibold text-orange-800">{account.accountClass}</Text>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full ${isArchived ? 'bg-gray-100' : 'bg-green-100'}`}>
                        <Text className={`text-xs font-semibold ${isArchived ? 'text-gray-800' : 'text-green-800'}`}>
                            {isArchived ? 'Archived' : 'Active'}
                        </Text>
                    </View>
                </View>

                {/* Balance */}
                <View className="mb-4">
                    <Text className="text-3xl font-bold text-gray-900">
                        {account.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <Text className="text-sm text-gray-500 uppercase">{account.currency}</Text>
                </View>

                {/* Stats Grid */}
                <View className="space-y-2 mb-4">
                    <View className="flex-row items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <View className="flex-row items-center gap-2 flex-1">
                            <Ionicons name="fingerprint" size={16} color="#9ca3af" />
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 uppercase">Account Number</Text>
                                <Text className="text-sm font-semibold text-gray-900">{account.accountNumber}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleCopyToClipboard(account.accountNumber, 'Account Number')}>
                            <Ionicons name="copy-outline" size={16} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <View className="flex-row items-center gap-2 flex-1">
                            <Ionicons name="card" size={16} color="#9ca3af" />
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 uppercase">Login</Text>
                                <Text className="text-sm font-semibold text-gray-900">{account.login}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleCopyToClipboard(account.login, 'Login')}>
                            <Ionicons name="copy-outline" size={16} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <View className="flex-row items-center gap-2 flex-1">
                            <Ionicons name="server" size={16} color="#9ca3af" />
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 uppercase">Server</Text>
                                <Text className="text-sm font-semibold text-gray-900">{account.server}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleCopyToClipboard(account.server, 'Server')}>
                            <Ionicons name="copy-outline" size={16} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Equity & Margin */}
                <View className="flex-row gap-2 mb-4">
                    <View className="flex-1 p-3 bg-green-50 rounded-lg border border-green-100">
                        <Text className="text-xs text-green-700 uppercase mb-1">Equity</Text>
                        <Text className="text-base font-bold text-green-900">
                            {account.currency} {(account.equity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                    <View className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Text className="text-xs text-blue-700 uppercase mb-1">Free Margin</Text>
                        <Text className="text-base font-bold text-blue-900">
                            {account.currency} {(account.freeMargin || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* Trading Info */}
                <View className="bg-orange-50 rounded-lg p-3 border border-orange-100 mb-4">
                    <Text className="text-xs text-orange-800 font-semibold uppercase mb-2">Trading Info</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Leverage</Text>
                            <Text className="text-sm font-bold text-orange-600">{account.leverage}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Spread</Text>
                            <Text className="text-sm font-medium text-gray-900">
                                {account.accountClass?.includes('Raw') || account.accountClass?.includes('Zero') ? 'Raw Spread' : 'Variable'}
                            </Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Commission</Text>
                            <Text className="text-sm font-medium text-gray-900">
                                {account.accountClass?.includes('Standard') ? 'No commission' : '$3.5 per lot'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                {isArchived ? (
                    <TouchableOpacity
                        onPress={() => handleReactivate(account._id)}
                        className="bg-orange-500 rounded-lg py-3 flex-row items-center justify-center gap-2"
                    >
                        <Ionicons name="reload" size={18} color="white" />
                        <Text className="text-white font-semibold">Reactivate</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => router.push('/deposit')}
                            className="flex-1 bg-green-50 border border-green-200 rounded-lg py-3 flex-row items-center justify-center gap-2"
                        >
                            <Ionicons name="add-circle" size={18} color="#10b981" />
                            <Text className="text-green-700 font-semibold">Deposit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/withdraw')}
                            className="flex-1 bg-red-50 border border-red-200 rounded-lg py-3 flex-row items-center justify-center gap-2"
                        >
                            <Ionicons name="remove-circle" size={18} color="#ef4444" />
                            <Text className="text-red-700 font-semibold">Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">Accounts</Text>
                        <Text className="text-gray-600 text-sm">Manage your trading accounts</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/new-account')}
                        className="bg-orange-500 rounded-lg px-4 py-2.5 flex-row items-center gap-2"
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text className="text-white font-semibold">New</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-gray-100 rounded-lg p-1">
                    {['Real', 'Demo', 'Archived'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Text className={`text-center font-semibold text-sm ${activeTab === tab ? 'text-gray-900' : 'text-gray-600'}`}>
                                {tab} ({tab === 'Real' ? realCount : tab === 'Demo' ? demoCount : archivedCount})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Search */}
            <View className="bg-white px-6 py-3 border-b border-gray-100">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <Ionicons name="search" size={18} color="#9ca3af" />
                    <TextInput
                        placeholder="Search accounts..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="flex-1 ml-2 text-gray-900"
                        placeholderTextColor="#9ca3af"
                    />
                    {searchTerm !== '' && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Ionicons name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results Count */}
            <View className="px-6 py-3 bg-gray-50">
                <Text className="text-sm text-gray-600">
                    Showing {filteredAccounts.length} of {accounts.filter(acc => {
                        if (activeTab === 'Real') return acc.accountType === 'Real' && acc.status !== 'closed'
                        if (activeTab === 'Demo') return acc.accountType === 'Demo' && acc.status !== 'closed'
                        if (activeTab === 'Archived') return acc.status === 'closed'
                        return true
                    }).length} accounts
                </Text>
            </View>

            {/* Accounts List */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#f97316" />
                    </View>
                ) : error ? (
                    <ErrorState
                        title="Failed to load accounts"
                        message={error}
                        onRetry={fetchAccounts}
                    />
                ) : filteredAccounts.length === 0 ? (
                    <EmptyState
                        icon="briefcase-outline"
                        title="No accounts found"
                        message={searchTerm ? 'Try adjusting your search' : `You don't have any ${activeTab.toLowerCase()} accounts yet`}
                        actionText={!searchTerm && activeTab !== 'Archived' ? 'Create Your First Account' : undefined}
                        onAction={!searchTerm && activeTab !== 'Archived' ? () => router.push('/new-account') : undefined}
                    />
                ) : (
                    <View className="py-4">
                        {filteredAccounts.map(renderAccountCard)}
                        <View className="h-20" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Accounts
