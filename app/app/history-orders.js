import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Image } from 'react-native'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import api from '@/services/api'

const DAY_FILTERS = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'All time', value: null },
]

const HistoryOrders = () => {
    const router = useRouter()
    const [accounts, setAccounts] = useState([])
    const [trades, setTrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    const [selectedAccount, setSelectedAccount] = useState('all')
    const [selectedDays, setSelectedDays] = useState(null)
    const [activeTab, setActiveTab] = useState('closed')
    const [showAccountPicker, setShowAccountPicker] = useState(false)
    const [showDaysPicker, setShowDaysPicker] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch accounts
            const accountsResponse = await api.get('/account/my-accounts')

            // Fetch trades
            const tradesResponse = await api.get('/trades/my-trades', {
                params: { limit: 1000 }
            })

            if (accountsResponse.data.success) {
                setAccounts(accountsResponse.data.data)
            }

            if (tradesResponse.data.success) {
                setTrades(tradesResponse.data.data)
            }
        } catch (err) {
            console.error('Failed to fetch data:', err)
            setError(err.response?.data?.message || 'Failed to load data')
            Alert.alert('Error', 'Failed to load data')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchData()
    }, [])

    // Filter and format trades
    const allOrders = useMemo(() => {
        let filteredTrades = trades

        // Filter by status (tab)
        filteredTrades = filteredTrades.filter((trade) =>
            activeTab === 'closed'
                ? trade.status === 'closed'
                : trade.status === 'open'
        )

        // Filter by account
        if (selectedAccount !== 'all') {
            filteredTrades = filteredTrades.filter(
                (trade) => trade.tradingAccountId?._id === selectedAccount
            )
        }

        // Filter by date
        if (selectedDays) {
            const now = new Date()
            filteredTrades = filteredTrades.filter((trade) => {
                const tradeDate = new Date(trade.openTime)
                const diffDays = (now - tradeDate) / (1000 * 3600 * 24)
                return diffDays <= selectedDays
            })
        }

        // Map to order format
        return filteredTrades.map((trade) => ({
            id: trade._id,
            tradeId: trade.tradeId,
            symbol: trade.symbol,
            symbolIcon: trade.symbolIcon,
            type: trade.type === 'buy' ? 'Buy' : 'Sell',
            openingTime: trade.openTime,
            closingTime: trade.closeTime,
            lots: trade.lots,
            openingPrice: trade.openPrice,
            closingPrice: trade.closePrice,
            profit: trade.profitLoss || 0,
            positionId: trade.tradeId,
            commission: trade.commission || 0,
            accountId: trade.tradingAccountId?._id,
            accountLogin: trade.tradingAccountId?.login,
        }))
    }, [trades, selectedAccount, selectedDays, activeTab])

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date
            .toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
            .replace(',', '')
    }

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading order history...</Text>
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
                        onPress={fetchData}
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
                {accounts.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6 py-20">
                        <Ionicons name="bar-chart-outline" size={80} color="#9ca3af" />
                        <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
                            No Trading Accounts
                        </Text>
                        <Text className="text-gray-600 text-center mb-6">
                            Create a trading account to start viewing your order history
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/new-account')}
                            className="bg-orange-500 px-6 py-3 rounded-lg"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white font-semibold">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="px-6 py-6">
                        {/* Filters */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Account</Text>
                            <TouchableOpacity
                                onPress={() => setShowAccountPicker(!showAccountPicker)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between mb-3"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-900 text-sm">
                                    {selectedAccount === 'all'
                                        ? 'All accounts'
                                        : (() => {
                                            const acc = accounts.find(a => a._id === selectedAccount)
                                            return acc ? `${acc.accountClass} ${acc.platform} #${acc.login}` : 'Select account'
                                        })()}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>

                            {showAccountPicker && (
                                <View className="border border-gray-300 rounded-lg bg-white mb-3 overflow-hidden">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedAccount('all')
                                            setShowAccountPicker(false)
                                        }}
                                        className={`px-4 py-3 border-b border-gray-100 ${selectedAccount === 'all' ? 'bg-orange-50' : ''}`}
                                        activeOpacity={0.7}
                                    >
                                        <Text className={selectedAccount === 'all' ? 'text-orange-600 font-semibold text-sm' : 'text-gray-900 text-sm'}>
                                            All accounts
                                        </Text>
                                    </TouchableOpacity>
                                    {accounts.map(acc => (
                                        <TouchableOpacity
                                            key={acc._id}
                                            onPress={() => {
                                                setSelectedAccount(acc._id)
                                                setShowAccountPicker(false)
                                            }}
                                            className={`px-4 py-3 border-b border-gray-100 ${selectedAccount === acc._id ? 'bg-orange-50' : ''}`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={selectedAccount === acc._id ? 'text-orange-600 font-semibold text-sm' : 'text-gray-900 text-sm'}>
                                                {acc.accountClass} {acc.platform} #{acc.login}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <Text className="text-sm font-medium text-gray-700 mb-2">Time Period</Text>
                            <TouchableOpacity
                                onPress={() => setShowDaysPicker(!showDaysPicker)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-900 text-sm">
                                    {DAY_FILTERS.find(f => f.value === selectedDays)?.label || 'All time'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>

                            {showDaysPicker && (
                                <View className="border border-gray-300 rounded-lg bg-white mt-2 overflow-hidden">
                                    {DAY_FILTERS.map(filter => (
                                        <TouchableOpacity
                                            key={filter.value || 'all'}
                                            onPress={() => {
                                                setSelectedDays(filter.value)
                                                setShowDaysPicker(false)
                                            }}
                                            className={`px-4 py-3 border-b border-gray-100 ${selectedDays === filter.value ? 'bg-orange-50' : ''}`}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={selectedDays === filter.value ? 'text-orange-600 font-semibold text-sm' : 'text-gray-900 text-sm'}>
                                                {filter.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Tabs */}
                        <View className="bg-white rounded-lg p-2 mb-4">
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => setActiveTab('closed')}
                                    className={`flex-1 py-2.5 rounded-lg ${activeTab === 'closed' ? 'bg-orange-500' : 'bg-white'}`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-center font-semibold text-sm ${activeTab === 'closed' ? 'text-white' : 'text-gray-600'}`}>
                                        Closed Orders
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveTab('open')}
                                    className={`flex-1 py-2.5 rounded-lg ${activeTab === 'open' ? 'bg-orange-500' : 'bg-white'}`}
                                    activeOpacity={0.7}
                                >
                                    <Text className={`text-center font-semibold text-sm ${activeTab === 'open' ? 'text-white' : 'text-gray-600'}`}>
                                        Open Orders
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Orders List */}
                        {allOrders.length === 0 ? (
                            <View className="bg-white rounded-xl border border-gray-200 p-12 items-center">
                                <Ionicons name="receipt-outline" size={64} color="#9ca3af" />
                                <Text className="text-gray-500 text-center mt-4">
                                    No {activeTab} orders found for selected filters
                                </Text>
                            </View>
                        ) : (
                            <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {allOrders.map((order, index) => (
                                    <React.Fragment key={order.id}>
                                        {activeTab === 'closed' ? (
                                            <ClosedOrderCard order={order} formatDateTime={formatDateTime} />
                                        ) : (
                                            <OpenOrderCard order={order} formatDateTime={formatDateTime} />
                                        )}
                                        {index < allOrders.length - 1 && (
                                            <View className="h-px bg-gray-200" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

// Symbol Icon Component
const SymbolIcon = ({ order }) => {
    if (order.symbolIcon) {
        return (
            <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center overflow-hidden">
                <Image
                    source={{ uri: order.symbolIcon }}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>
        )
    }

    const fallbackText = order.symbol.charAt(0)
    return (
        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
            <Text className="text-sm font-bold text-blue-700">{fallbackText}</Text>
        </View>
    )
}

// Closed Order Card
const ClosedOrderCard = ({ order, formatDateTime }) => (
    <View className="p-4">
        <View className="flex-row items-start justify-between mb-3">
            <View className="flex-row items-center flex-1">
                <SymbolIcon order={order} />
                <View className="ml-3 flex-1">
                    <Text className="text-base font-bold text-gray-900 mb-0.5">{order.symbol}</Text>
                    <View className={`px-2 py-1 rounded self-start ${order.type === 'Buy' ? 'bg-blue-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs font-semibold ${order.type === 'Buy' ? 'text-blue-700' : 'text-red-700'}`}>
                            {order.type}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="items-end">
                <Text className={`text-lg font-bold ${order.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {order.profit >= 0 ? '+' : ''}{order.profit.toFixed(2)} USD
                </Text>
            </View>
        </View>

        <View style={{ gap: 6 }}>
            <InfoRow label="Opening Time" value={formatDateTime(order.openingTime)} />
            <InfoRow label="Closing Time" value={formatDateTime(order.closingTime)} />
            <InfoRow label="Lots" value={order.lots} />
            <InfoRow label="Opening Price" value={order.openingPrice?.toFixed(5)} />
            <InfoRow label="Closing Price" value={order.closingPrice?.toFixed(5)} />
        </View>
    </View>
)

// Open Order Card
const OpenOrderCard = ({ order, formatDateTime }) => (
    <View className="p-4">
        <View className="flex-row items-start justify-between mb-3">
            <View className="flex-row items-center flex-1">
                <SymbolIcon order={order} />
                <View className="ml-3 flex-1">
                    <Text className="text-base font-bold text-gray-900 mb-0.5">{order.symbol}</Text>
                    <View className={`px-2 py-1 rounded self-start ${order.type === 'Buy' ? 'bg-blue-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs font-semibold ${order.type === 'Buy' ? 'text-blue-700' : 'text-red-700'}`}>
                            {order.type}
                        </Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ gap: 6 }}>
            <InfoRow label="Opening Time" value={formatDateTime(order.openingTime)} />
            <InfoRow label="Lots" value={order.lots} />
            <InfoRow label="Opening Price" value={order.openingPrice?.toFixed(5)} />
            <InfoRow label="Position ID" value={order.positionId} />
            <InfoRow label="Commission" value={`${order.commission.toFixed(2)} USD`} />
        </View>
    </View>
)

// Info Row Component
const InfoRow = ({ label, value }) => (
    <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500 uppercase tracking-wide">{label}</Text>
        <Text className="text-sm text-gray-900 font-medium">{value}</Text>
    </View>
)

export default HistoryOrders
