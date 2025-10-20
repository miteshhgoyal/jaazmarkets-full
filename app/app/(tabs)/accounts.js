import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Platform, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import api from '@/services/api'

const Accounts = () => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Real')

    // State
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    // Filter state
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [platformFilter, setPlatformFilter] = useState('all')
    const [classFilter, setClassFilter] = useState('all')
    const [balanceRangeFilter, setBalanceRangeFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchAccounts()
    }, [activeTab])

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
            setRefreshing(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchAccounts()
    }, [])

    // Filter and sort accounts
    const getFilteredAccounts = () => {
        let filtered = accounts

        // Filter by account type (tab)
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
                    acc.accountClass?.toLowerCase().includes(searchLower) ||
                    acc.server?.toLowerCase().includes(searchLower)
            )
        }

        // Platform filter
        if (platformFilter !== 'all') {
            filtered = filtered.filter((acc) => acc.platform === platformFilter)
        }

        // Class filter
        if (classFilter !== 'all') {
            filtered = filtered.filter((acc) => acc.accountClass === classFilter)
        }

        // Balance range filter
        if (balanceRangeFilter !== 'all') {
            const [min, max] = balanceRangeFilter.split('-').map(Number)
            filtered = filtered.filter((acc) => {
                const balance = acc.balance || 0
                return balance >= min && (max ? balance <= max : true)
            })
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
                case 'name-asc':
                    return (a.accountNumber || '').localeCompare(b.accountNumber || '')
                case 'name-desc':
                    return (b.accountNumber || '').localeCompare(a.accountNumber || '')
                default:
                    return 0
            }
        })

        return filtered
    }

    const filteredAccounts = getFilteredAccounts()

    // Get unique values for filters
    const platformOptions = [...new Set(accounts.map((acc) => acc.platform))].filter(Boolean)
    const classOptions = [...new Set(accounts.map((acc) => acc.accountClass))].filter(Boolean)

    // Check if filters are active
    const hasActiveFilters =
        searchTerm !== '' ||
        platformFilter !== 'all' ||
        classFilter !== 'all' ||
        balanceRangeFilter !== 'all' ||
        sortBy !== 'newest'

    const clearFilters = () => {
        setSearchTerm('')
        setSortBy('newest')
        setPlatformFilter('all')
        setClassFilter('all')
        setBalanceRangeFilter('all')
    }

    // Count accounts by type
    const realCount = accounts.filter(
        (acc) => acc.accountType === 'Real' && acc.status !== 'closed'
    ).length
    const demoCount = accounts.filter(
        (acc) => acc.accountType === 'Demo' && acc.status !== 'closed'
    ).length
    const archivedCount = accounts.filter(
        (acc) => acc.status === 'closed'
    ).length

    const handleReactivate = async (accountId) => {
        try {
            const response = await api.patch(`/account/${accountId}/status`, {
                status: 'active',
            })

            if (response.data.success) {
                Alert.alert('Success', 'Account reactivated successfully')
                fetchAccounts()
            }
        } catch (err) {
            console.error('Failed to reactivate account:', err)
            Alert.alert('Error', 'Failed to reactivate account')
        }
    }

    const copyToClipboard = async (text, label) => {
        await Clipboard.setStringAsync(text)
        Alert.alert('Copied', `${label} copied to clipboard`)
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-2xl font-bold text-gray-900">Trading Accounts</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/new-account')}
                        className="bg-orange-500 px-2 py-2 rounded-full flex-row items-center gap-2"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-600 text-sm">Manage your trading accounts</Text>
            </View>

            {/* Tabs */}
            <View className="bg-white border-b border-gray-200 px-6 py-3">
                <View className="flex-row gap-4">
                    <TabButton
                        label="Real Accounts"
                        count={realCount}
                        isActive={activeTab === 'Real'}
                        onPress={() => setActiveTab('Real')}
                    />
                    <TabButton
                        label="Demo Accounts"
                        count={demoCount}
                        isActive={activeTab === 'Demo'}
                        onPress={() => setActiveTab('Demo')}
                    />
                    <TabButton
                        label="Archived"
                        count={archivedCount}
                        isActive={activeTab === 'Archived'}
                        onPress={() => setActiveTab('Archived')}
                    />
                </View>
            </View>

            {/* Results Summary */}
            <View className="px-6 py-3 bg-gray-50">
                <Text className="text-sm text-gray-600">
                    Showing {filteredAccounts.length} of {accounts.filter((acc) => {
                        if (activeTab === 'Real') return acc.accountType === 'Real' && acc.status !== 'closed'
                        if (activeTab === 'Demo') return acc.accountType === 'Demo' && acc.status !== 'closed'
                        if (activeTab === 'Archived') return acc.status === 'closed'
                        return true
                    }).length} accounts
                    {hasActiveFilters && ' (Filtered)'}
                </Text>
            </View>

            {/* Accounts List */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f97316']} />
                }
            >
                {loading && !refreshing ? (
                    <View className="flex-1 items-center justify-center py-12">
                        <ActivityIndicator size="large" color="#f97316" />
                    </View>
                ) : error ? (
                    <View className="bg-white rounded-lg p-8 mt-4">
                        <View className="items-center">
                            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                            <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">Failed to Load Accounts</Text>
                            <Text className="text-gray-600 text-center mb-6">{error}</Text>
                            <TouchableOpacity
                                onPress={fetchAccounts}
                                className="bg-orange-500 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-semibold">Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : filteredAccounts.length === 0 ? (
                    <View className="bg-white rounded-lg p-8 mt-4">
                        <View className="items-center">
                            <Ionicons name="wallet-outline" size={64} color="#9ca3af" />
                            <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">No accounts found</Text>
                            <Text className="text-gray-600 text-center mb-6">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters to see more results'
                                    : `You don't have any ${activeTab.toLowerCase()} accounts yet`}
                            </Text>
                            {!hasActiveFilters && activeTab !== 'Archived' && (
                                <TouchableOpacity
                                    onPress={() => router.push('/new-account')}
                                    className="bg-orange-500 px-6 py-3 rounded-lg flex-row items-center gap-2"
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                    <Text className="text-white font-semibold">Create Your First Account</Text>
                                </TouchableOpacity>
                            )}
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={clearFilters}
                                    className="bg-white border-2 border-gray-300 px-6 py-3 rounded-lg"
                                >
                                    <Text className="text-gray-900 font-semibold">Clear Filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ) : (
                    <View className="py-4">
                        {filteredAccounts.map((account) => (
                            <View key={account._id} className="mb-4">
                                {activeTab === 'Archived' ? (
                                    <ArchivedAccountCard
                                        account={account}
                                        onReactivate={() => handleReactivate(account._id)}
                                    />
                                ) : (
                                    <ActiveAccountCard
                                        account={account}
                                        onCopyToClipboard={copyToClipboard}
                                        router={router}
                                    />
                                )}
                            </View>
                        ))}
                        <View className="h-6" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

// Helper Components
const TabButton = ({ label, count, isActive, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`pb-2 border-b-2 ${isActive ? 'border-orange-500' : 'border-transparent'}`}
    >
        <View className="flex-row items-center gap-2">
            <Text className={`font-semibold ${isActive ? 'text-orange-500' : 'text-gray-600'}`}>
                {label}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <Text className={`text-xs font-medium ${isActive ? 'text-orange-700' : 'text-gray-600'}`}>
                    {count}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
)

const FilterSelect = ({ label, value, onChange, options }) => {
    const [showPicker, setShowPicker] = useState(false)
    const selectedLabel = options.find(o => o.value === value)?.label || ''

    return (
        <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <TouchableOpacity
                onPress={() => setShowPicker(!showPicker)}
                className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between"
            >
                <Text className="text-gray-900">{selectedLabel}</Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {showPicker && (
                <View className="mt-2 border border-gray-300 rounded-lg bg-white overflow-hidden">
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => {
                                onChange(option.value)
                                setShowPicker(false)
                            }}
                            className={`px-4 py-3 border-b border-gray-100 ${value === option.value ? 'bg-orange-50' : 'bg-white'}`}
                        >
                            <Text className={`${value === option.value ? 'text-orange-600 font-semibold' : 'text-gray-900'}`}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    )
}

const ActiveAccountCard = ({ account, onCopyToClipboard, router }) => {
    const [showDetails, setShowDetails] = useState(false)

    const formatCurrency = (amount, currency) => {
        return `${currency} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <View className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <View className="p-4 border-b border-gray-100">
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row flex-wrap gap-2">
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            <Text className="text-orange-700 font-semibold text-xs">{account.accountType}</Text>
                        </View>
                        <View className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-blue-700 font-semibold text-xs">{account.platform}</Text>
                        </View>
                        <View className="bg-purple-100 px-3 py-1 rounded-full">
                            <Text className="text-purple-700 font-semibold text-xs">{account.accountClass}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-gray-600 text-xs mb-1">Balance</Text>
                        <Text className="text-2xl font-bold text-gray-900">
                            {formatCurrency(account.balance, account.currency)}
                        </Text>
                    </View>

                    {/* Updated with proper routing */}
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => router.push('/deposit')}
                            className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center gap-1"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="add" size={16} color="white" />
                            <Text className="text-white font-semibold text-sm">Deposit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/withdrawal')}
                            className="bg-white border border-gray-300 px-4 py-2 rounded-lg flex-row items-center gap-1"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="remove" size={16} color="#374151" />
                            <Text className="text-gray-700 font-semibold text-sm">Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Account Details */}
            <View className="p-4">
                <View className="flex-row flex-wrap gap-4 mb-4">
                    <StatItem label="Equity" value={formatCurrency(account.equity || account.balance, account.currency)} />
                    <StatItem label="Margin" value={formatCurrency(account.margin || 0, account.currency)} />
                    <StatItem label="Free Margin" value={formatCurrency(account.freeMargin || account.balance, account.currency)} />
                    <StatItem label="Leverage" value={account.leverage} />
                </View>

                {/* Toggle Details */}
                <TouchableOpacity
                    onPress={() => setShowDetails(!showDetails)}
                    className="flex-row items-center justify-center gap-2 py-2 border-t border-gray-100"
                >
                    <Text className="text-gray-600 font-medium text-sm">
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </Text>
                    <Ionicons name={showDetails ? 'chevron-up' : 'chevron-down'} size={20} color="#6b7280" />
                </TouchableOpacity>

                {/* Expanded Details */}
                {showDetails && (
                    <View className="mt-4 border-t border-gray-100 pt-4">
                        <DetailRow
                            label="Account Number"
                            value={account.accountNumber}
                            copyable
                            onCopy={() => onCopyToClipboard(account.accountNumber, 'Account Number')}
                        />
                        <DetailRow
                            label="Login"
                            value={account.login}
                            copyable
                            onCopy={() => onCopyToClipboard(account.login, 'Login')}
                        />
                        <DetailRow
                            label="Server"
                            value={account.server}
                            copyable
                            onCopy={() => onCopyToClipboard(account.server, 'Server')}
                        />
                        <DetailRow label="Created" value={formatDate(account.createdAt)} />
                        <DetailRow label="Status" value={account.status} />
                    </View>
                )}
            </View>
        </View>
    )
}

const ArchivedAccountCard = ({ account, onReactivate }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const formatCurrency = (amount, currency) => {
        return `${currency} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
        <View className="bg-white rounded-lg shadow-sm overflow-hidden opacity-75">
            <View className="p-4">
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row flex-wrap gap-2">
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-gray-700 font-semibold text-xs">{account.accountType}</Text>
                        </View>
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-gray-700 font-semibold text-xs">{account.platform}</Text>
                        </View>
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-gray-700 font-semibold text-xs">{account.accountClass}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons name="calendar-outline" size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-500">{formatDate(account.updatedAt)}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-gray-600 text-xs mb-1">Balance</Text>
                        <Text className="text-xl font-bold text-gray-900">
                            {formatCurrency(account.balance, account.currency)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onReactivate}
                        className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center gap-2"
                    >
                        <Ionicons name="refresh" size={16} color="white" />
                        <Text className="text-white font-semibold text-sm">Reactivate</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <View className="flex-row items-start gap-2">
                        <View className="w-2 h-2 bg-amber-400 rounded-full mt-1.5" />
                        <View className="flex-1">
                            <Text className="text-amber-800 text-sm font-medium">
                                {account.archiveReason || 'Account archived due to inactivity'}
                            </Text>
                            <Text className="text-amber-700 text-xs mt-1">
                                Archived on {formatDate(account.updatedAt)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const StatItem = ({ label, value }) => (
    <View className="flex-1 min-w-[100px]">
        <Text className="text-gray-600 text-xs mb-1">{label}</Text>
        <Text className="text-gray-900 font-semibold text-sm">{value}</Text>
    </View>
)

const DetailRow = ({ label, value, copyable, onCopy }) => (
    <View className="flex-row items-center justify-between py-2">
        <Text className="text-gray-600 text-sm">{label}</Text>
        <View className="flex-row items-center gap-2">
            <Text className="text-gray-900 font-medium text-sm">{value}</Text>
            {copyable && (
                <TouchableOpacity onPress={onCopy} className="p-1">
                    <Ionicons name="copy-outline" size={16} color="#6b7280" />
                </TouchableOpacity>
            )}
        </View>
    </View>
)

export default Accounts
