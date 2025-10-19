import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl, Share } from 'react-native'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import api from '@/services/api'

const Transactions = () => {
    const router = useRouter()

    // Data
    const [deposits, setDeposits] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [transfers, setTransfers] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    // Filters
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    // UI
    const [showFilters, setShowFilters] = useState(false)
    const [showSortPicker, setShowSortPicker] = useState(false)
    const [showStatusPicker, setShowStatusPicker] = useState(false)
    const [showTypePicker, setShowTypePicker] = useState(false)

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            setError(null)

            const [depositsRes, withdrawalsRes, transfersRes] = await Promise.all([
                api.get('/transactions/deposits', { params: { limit: 1000 } }),
                api.get('/transactions/withdrawals', { params: { limit: 1000 } }),
                api.get('/transactions/transfers', { params: { limit: 1000 } }).catch(() => ({ data: { success: true, data: [] } }))
            ])

            if (depositsRes.data.success) {
                setDeposits(depositsRes.data.data)
            }

            if (withdrawalsRes.data.success) {
                setWithdrawals(withdrawalsRes.data.data)
            }

            if (transfersRes.data.success) {
                setTransfers(transfersRes.data.data)
            }
        } catch (err) {
            console.error('Failed to fetch transactions:', err)
            setError(err.response?.data?.message || 'Failed to load transactions')
            Alert.alert('Error', 'Failed to load transactions')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchTransactions()
    }, [])

    // Combine and format transactions
    const transactions = useMemo(() => {
        const formattedDeposits = deposits.map((dep) => ({
            _id: dep._id,
            transactionId: dep.transactionId,
            type: 'deposit',
            amount: dep.amount,
            currency: dep.currency,
            method: dep.paymentMethod,
            methodDetails: dep.paymentDetails?.cryptocurrency || dep.paymentMethod,
            network: dep.paymentDetails?.network || '',
            status: dep.status,
            createdAt: dep.createdAt,
            completedAt: dep.completedAt,
            fee: 0,
            description: dep.userNotes || '',
            accountNumber: dep.tradingAccountId?.accountNumber || 'N/A',
        }))

        const formattedWithdrawals = withdrawals.map((wd) => ({
            _id: wd._id,
            transactionId: wd.transactionId,
            type: 'withdrawal',
            amount: wd.amount,
            currency: wd.currency,
            method: wd.withdrawalMethod,
            methodDetails: wd.withdrawalDetails?.cryptocurrency || wd.withdrawalMethod,
            network: wd.withdrawalDetails?.network || '',
            walletAddress: wd.withdrawalDetails?.walletAddress || '',
            status: wd.status,
            createdAt: wd.createdAt,
            completedAt: wd.completedAt,
            fee: wd.fee || 0,
            netAmount: wd.netAmount,
            description: wd.adminNotes || wd.rejectionReason || '',
            accountNumber: wd.tradingAccountId?.accountNumber || 'N/A',
        }))

        const formattedTransfers = transfers.map((tr) => ({
            _id: tr._id,
            transactionId: tr.transactionId,
            type: 'transfer',
            amount: tr.amount,
            currency: tr.currency,
            method: tr.methodType || 'Internal',
            status: tr.status,
            createdAt: tr.createdAt,
            completedAt: tr.completedAt,
            fee: 0,
            description: tr.metadata?.note || '',
            fromAccount: tr.fromAccountId?.accountNumber || 'N/A',
            toAccount: tr.toAccountId?.accountNumber || tr.recipientAccountNumber || 'N/A',
        }))

        return [...formattedDeposits, ...formattedWithdrawals, ...formattedTransfers]
    }, [deposits, withdrawals, transfers])

    // Filter by tab
    const filteredByTab = useMemo(() => {
        switch (activeTab) {
            case 'deposits':
                return transactions.filter((tx) => tx.type === 'deposit')
            case 'withdrawals':
                return transactions.filter((tx) => tx.type === 'withdrawal')
            case 'transfers':
                return transactions.filter((tx) => tx.type === 'transfer')
            default:
                return transactions
        }
    }, [transactions, activeTab])

    // Apply filters and search
    const filteredTransactions = useMemo(() => {
        let filtered = filteredByTab

        // Search
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (tx) =>
                    tx.transactionId?.toLowerCase().includes(searchLower) ||
                    tx.method?.toLowerCase().includes(searchLower) ||
                    tx.currency?.toLowerCase().includes(searchLower) ||
                    tx.status?.toLowerCase().includes(searchLower) ||
                    tx.type?.toLowerCase().includes(searchLower)
            )
        }

        // Type filter
        if (typeFilter) {
            filtered = filtered.filter((tx) => tx.type === typeFilter)
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter((tx) => tx.status === statusFilter)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case 'amount-high':
                    return b.amount - a.amount
                case 'amount-low':
                    return a.amount - b.amount
                default:
                    return 0
            }
        })

        return filtered
    }, [filteredByTab, searchTerm, typeFilter, statusFilter, sortBy])

    // Summary stats
    const summaryStats = useMemo(() => {
        const completedDeposits = deposits.filter((d) => d.status === 'completed')
        const totalDeposited = completedDeposits.reduce((sum, d) => sum + d.amount, 0)

        const completedWithdrawals = withdrawals.filter((w) => w.status === 'completed')
        const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0)

        const pendingCount = transactions.filter((t) => t.status === 'pending').length

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayCount = transactions.filter((t) => {
            const txDate = new Date(t.createdAt)
            txDate.setHours(0, 0, 0, 0)
            return txDate.getTime() === today.getTime()
        }).length

        return {
            totalDeposited,
            totalWithdrawn,
            pendingCount,
            todayCount,
        }
    }, [deposits, withdrawals, transactions])

    const clearFilters = () => {
        setSearchTerm('')
        setSortBy('newest')
        setStatusFilter('')
        setTypeFilter('')
    }

    const hasActiveFilters = searchTerm !== '' || statusFilter !== '' || typeFilter !== '' || sortBy !== 'newest'

    const formatCurrency = (amount, currency) => {
        return `${parseFloat(amount).toFixed(2)} ${currency}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-orange-100 text-orange-800'
            case 'processing':
                return 'bg-blue-100 text-blue-800'
            case 'failed':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'deposit':
                return 'arrow-down-circle'
            case 'withdrawal':
                return 'arrow-up-circle'
            case 'transfer':
                return 'swap-horizontal'
            default:
                return 'cash'
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'deposit':
                return 'text-green-600'
            case 'withdrawal':
                return 'text-red-600'
            case 'transfer':
                return 'text-blue-600'
            default:
                return 'text-gray-600'
        }
    }

    const exportTransactions = async () => {
        const csvContent = [
            ['Transaction ID', 'Type', 'Amount', 'Currency', 'Method', 'Status', 'Date'],
            ...filteredTransactions.map((tx) => [
                tx.transactionId,
                tx.type,
                tx.amount,
                tx.currency,
                tx.method,
                tx.status,
                formatDate(tx.createdAt),
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n')

        try {
            await Share.share({
                message: csvContent,
                title: 'Transaction History',
            })
        } catch (error) {
            console.error('Error sharing:', error)
        }
    }

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading transactions...</Text>
            </View>
        )
    }

    if (error && transactions.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                        Error Loading Transactions
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">{error}</Text>
                    <TouchableOpacity
                        onPress={fetchTransactions}
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
                {/* Summary Cards */}
                <View className="px-6 py-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-2xl font-bold text-gray-900">Transactions</Text>
                        <TouchableOpacity
                            onPress={exportTransactions}
                            className="flex-row items-center bg-white border border-gray-300 px-4 py-2 rounded-lg"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="download-outline" size={16} color="#374151" />
                            <Text className="text-gray-700 ml-2 text-sm font-medium">Export</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-3 mb-6">
                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Total Deposited</Text>
                                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                                    <Ionicons name="arrow-down" size={16} color="#15803d" />
                                </View>
                            </View>
                            <Text className="text-xl font-bold text-green-600">
                                ${summaryStats.totalDeposited.toFixed(2)}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Total Withdrawn</Text>
                                <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                                    <Ionicons name="arrow-up" size={16} color="#dc2626" />
                                </View>
                            </View>
                            <Text className="text-xl font-bold text-red-600">
                                ${summaryStats.totalWithdrawn.toFixed(2)}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Pending</Text>
                                <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                                    <Ionicons name="time" size={16} color="#ea580c" />
                                </View>
                            </View>
                            <Text className="text-xl font-bold text-orange-600">
                                {summaryStats.pendingCount}
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">Today</Text>
                                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                                    <Ionicons name="calendar" size={16} color="#2563eb" />
                                </View>
                            </View>
                            <Text className="text-xl font-bold text-blue-600">
                                {summaryStats.todayCount}
                            </Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="bg-white rounded-xl p-2 mb-4">
                        <View className="flex-row gap-2">
                            {['all', 'deposits', 'withdrawals', 'transfers'].map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`flex-1 py-2.5 rounded-lg ${activeTab === tab ? 'bg-orange-500' : 'bg-white'
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        className={`text-center font-semibold text-xs ${activeTab === tab ? 'text-white' : 'text-gray-600'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Search and Filters */}
                    <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                        <View className="relative mb-3">
                            <Ionicons
                                name="search"
                                size={18}
                                color="#9ca3af"
                                style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
                            />
                            <TextInput
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowFilters(!showFilters)}
                            className="flex-row items-center justify-center py-2"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="options-outline" size={16} color="#374151" />
                            <Text className="text-gray-700 ml-2 text-sm font-medium">
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Text>
                        </TouchableOpacity>

                        {showFilters && (
                            <View style={{ gap: 12 }} className="mt-3">
                                <TouchableOpacity
                                    onPress={() => setShowSortPicker(!showSortPicker)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-gray-900 text-sm">
                                        Sort: {sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : sortBy === 'amount-high' ? 'Highest Amount' : 'Lowest Amount'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                                </TouchableOpacity>

                                {showSortPicker && (
                                    <View className="border border-gray-300 rounded-lg overflow-hidden">
                                        {['newest', 'oldest', 'amount-high', 'amount-low'].map((sort) => (
                                            <TouchableOpacity
                                                key={sort}
                                                onPress={() => {
                                                    setSortBy(sort)
                                                    setShowSortPicker(false)
                                                }}
                                                className={`px-4 py-3 ${sortBy === sort ? 'bg-orange-50' : 'bg-white'}`}
                                                activeOpacity={0.7}
                                            >
                                                <Text className={sortBy === sort ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                                                    {sort === 'newest' ? 'Newest First' : sort === 'oldest' ? 'Oldest First' : sort === 'amount-high' ? 'Highest Amount' : 'Lowest Amount'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {hasActiveFilters && (
                                    <TouchableOpacity
                                        onPress={clearFilters}
                                        className="bg-gray-100 py-2 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-700 font-medium text-center text-sm">
                                            Clear Filters
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Results Count */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-sm text-gray-600">
                            Showing {filteredTransactions.length} of {filteredByTab.length} transactions
                        </Text>
                        {hasActiveFilters && (
                            <View className="px-2 py-1 bg-orange-100 rounded-full">
                                <Text className="text-orange-800 text-xs font-medium">Filtered</Text>
                            </View>
                        )}
                    </View>

                    {/* Transaction List */}
                    {filteredTransactions.length === 0 ? (
                        <View className="bg-white rounded-xl border border-gray-200 p-12 items-center">
                            <Ionicons name="receipt-outline" size={64} color="#9ca3af" />
                            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2 text-center">
                                No Transactions Found
                            </Text>
                            <Text className="text-gray-600 text-center">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters'
                                    : 'Your transaction history will appear here'}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {filteredTransactions.map((tx) => (
                                <View key={tx._id} className="bg-white rounded-xl border border-gray-200 p-4">
                                    <View className="flex-row items-start justify-between mb-3">
                                        <View className="flex-row items-start flex-1">
                                            <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
                                                <Ionicons name={getTypeIcon(tx.type)} size={20} color={getTypeColor(tx.type).replace('text-', '#')} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-bold text-gray-900 mb-1">
                                                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                                </Text>
                                                <View className={`px-2 py-1 rounded self-start ${getStatusColor(tx.status)}`}>
                                                    <Text className="text-xs font-semibold">
                                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className={`text-lg font-bold ${getTypeColor(tx.type)}`}>
                                                {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                                                {formatCurrency(tx.amount, tx.currency)}
                                            </Text>
                                            {tx.fee > 0 && (
                                                <Text className="text-xs text-gray-500">
                                                    Fee: {formatCurrency(tx.fee, tx.currency)}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={{ gap: 4 }} className="pt-3 border-t border-gray-100">
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 w-20">ID:</Text>
                                            <Text className="text-xs text-gray-900 flex-1" numberOfLines={1}>
                                                {tx.transactionId}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 w-20">Method:</Text>
                                            <Text className="text-xs text-gray-900">{tx.method}</Text>
                                        </View>
                                        {tx.network && (
                                            <View className="flex-row items-center">
                                                <Text className="text-xs text-gray-500 w-20">Network:</Text>
                                                <Text className="text-xs text-gray-900">{tx.network}</Text>
                                            </View>
                                        )}
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-gray-500 w-20">Date:</Text>
                                            <Text className="text-xs text-gray-900">{formatDate(tx.createdAt)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Transactions
