import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'
import { LineChart, BarChart } from 'react-native-chart-kit'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CHART_WIDTH = SCREEN_WIDTH - 48 // Accounting for padding

// Calculate stats from accounts
const getStatsForAccounts = (accounts, dateFilter) => {
    if (!accounts || accounts.length === 0) {
        return {
            netProfit: 0,
            totalProfit: 0,
            totalLoss: 0,
            closedOrders: 0,
            profitableOrders: 0,
            unprofitableOrders: 0,
            tradingVolume: 0,
            lifetimeTradingVolume: 0,
            equity: 0,
            currentEquity: 0,
            totalBalance: 0,
            freeMargin: 0,
        }
    }

    const now = new Date()
    const filtered = accounts.filter(acc => {
        if (!dateFilter) return true
        const createdAt = new Date(acc.createdAt)
        const diffDays = (now - createdAt) / (1000 * 3600 * 24)
        return diffDays <= dateFilter
    })

    const totalProfit = filtered.reduce((sum, acc) => sum + parseFloat(acc.totalProfit || 0), 0)
    const totalLoss = filtered.reduce((sum, acc) => sum + parseFloat(acc.totalLoss || 0), 0)
    const netProfit = totalProfit - totalLoss
    const profitableOrders = filtered.reduce((sum, acc) => sum + parseInt(acc.profitableOrders || 0), 0)
    const unprofitableOrders = filtered.reduce((sum, acc) => sum + parseInt(acc.unprofitableOrders || 0), 0)
    const closedOrders = profitableOrders + unprofitableOrders
    const tradingVolume = filtered.reduce((sum, acc) => sum + parseFloat(acc.tradingVolume || 0), 0)
    const lifetimeTradingVolume = filtered.reduce((sum, acc) => sum + parseFloat(acc.lifetimeTradingVolume || 0), 0)
    const equity = filtered.reduce((sum, acc) => sum + parseFloat(acc.equity || 0), 0)
    const currentEquity = filtered.reduce((sum, acc) => sum + parseFloat(acc.equity || 0), 0)
    const totalBalance = filtered.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
    const freeMargin = filtered.reduce((sum, acc) => sum + parseFloat(acc.freeMargin || 0), 0)

    return {
        netProfit,
        totalProfit,
        totalLoss,
        closedOrders,
        profitableOrders,
        unprofitableOrders,
        tradingVolume,
        lifetimeTradingVolume,
        equity,
        currentEquity,
        totalBalance,
        freeMargin,
    }
}

// Generate chart data
const generateChartData = (accounts, dateFilter) => {
    if (!accounts || accounts.length === 0) return []

    const now = new Date()
    const daysToShow = dateFilter || 365
    const dataPoints = Math.min(daysToShow, 30)
    const chartData = []

    for (let i = dataPoints - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        const relevantAccounts = accounts.filter(acc => {
            const createdAt = new Date(acc.createdAt)
            return createdAt <= date
        })

        if (relevantAccounts.length > 0) {
            const stats = getStatsForAccounts(relevantAccounts, null)
            chartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                netProfit: parseFloat(stats.netProfit.toFixed(2)),
                totalProfit: parseFloat(stats.totalProfit.toFixed(2)),
                totalLoss: parseFloat(stats.totalLoss.toFixed(2)),
                closedOrders: stats.closedOrders,
                profitableOrders: stats.profitableOrders,
                unprofitableOrders: stats.unprofitableOrders,
                tradingVolume: parseFloat(stats.tradingVolume.toFixed(2)),
                equity: parseFloat(stats.equity.toFixed(2)),
            })
        }
    }

    return chartData
}

const DAY_FILTERS = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 365 days', value: 365 },
    { label: 'All time', value: null },
]

const CHART_TABS = [
    { id: 'netprofit', label: 'Net Profit' },
    { id: 'closedorders', label: 'Closed Orders' },
    { id: 'tradingvolume', label: 'Trading Volume' },
    { id: 'equity', label: 'Equity' },
]

const Performance = () => {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)
    const [selectedAccount, setSelectedAccount] = useState('all')
    const [selectedDays, setSelectedDays] = useState(365)
    const [activeChartTab, setActiveChartTab] = useState('netprofit')
    const [showAccountPicker, setShowAccountPicker] = useState(false)
    const [showDaysPicker, setShowDaysPicker] = useState(false)

    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await api.get('/account/my-accounts')

            if (response.data.success) {
                // Filter only active Real accounts for summary
                const realAccounts = response.data.data.filter(
                    acc => acc.accountType === 'Real' && acc.status === 'active'
                )
                setAccounts(realAccounts)
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

    const filteredAccounts = useMemo(() => {
        if (selectedAccount === 'all') return accounts
        return accounts.filter(acc => acc.id === selectedAccount)
    }, [accounts, selectedAccount])

    const stats = useMemo(
        () => getStatsForAccounts(filteredAccounts, selectedDays),
        [filteredAccounts, selectedDays]
    )

    const chartData = useMemo(
        () => generateChartData(filteredAccounts, selectedDays),
        [filteredAccounts, selectedDays]
    )

    const formatCurrency = (amount) => {
        return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <View className="items-center justify-center py-20">
                    <Ionicons name="bar-chart-outline" size={64} color="#9ca3af" />
                    <Text className="text-gray-500 mt-4">No data available for the selected period</Text>
                </View>
            )
        }

        const chartConfig = {
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
                borderRadius: 16,
            },
            propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#f97316',
            },
        }

        switch (activeChartTab) {
            case 'netprofit':
                return (
                    <LineChart
                        data={{
                            labels: chartData.map(d => d.date),
                            datasets: [
                                {
                                    data: chartData.map(d => d.netProfit),
                                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                                    strokeWidth: 2,
                                },
                            ],
                        }}
                        width={CHART_WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                )
            case 'closedorders':
                return (
                    <BarChart
                        data={{
                            labels: chartData.slice(-7).map(d => d.date),
                            datasets: [
                                {
                                    data: chartData.slice(-7).map(d => d.closedOrders),
                                },
                            ],
                        }}
                        width={CHART_WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                )
            case 'tradingvolume':
                return (
                    <LineChart
                        data={{
                            labels: chartData.map(d => d.date),
                            datasets: [
                                {
                                    data: chartData.map(d => d.tradingVolume),
                                    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                                    strokeWidth: 2,
                                },
                            ],
                        }}
                        width={CHART_WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                )
            case 'equity':
                return (
                    <LineChart
                        data={{
                            labels: chartData.map(d => d.date),
                            datasets: [
                                {
                                    data: chartData.map(d => d.equity),
                                    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
                                    strokeWidth: 2,
                                },
                            ],
                        }}
                        width={CHART_WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                )
            default:
                return null
        }
    }

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading performance data...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">Failed to Load Data</Text>
                    <Text className="text-gray-600 text-center mb-6">{error}</Text>
                    <TouchableOpacity onPress={fetchAccounts} className="bg-orange-500 px-6 py-3 rounded-lg">
                        <Text className="text-white font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">Performance History</Text>
                <Text className="text-gray-600 text-sm mt-1">Track your trading performance</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f97316']} />
                }
            >
                {accounts.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6 py-20">
                        <Ionicons name="bar-chart-outline" size={80} color="#9ca3af" />
                        <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">No Active Real Accounts</Text>
                        <Text className="text-gray-600 text-center mb-6">
                            Create a real trading account to see your performance statistics
                        </Text>
                    </View>
                ) : (
                    <View className="px-6 py-6">
                        {/* Filters */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Account</Text>
                            <TouchableOpacity
                                onPress={() => setShowAccountPicker(!showAccountPicker)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between mb-4"
                            >
                                <Text className="text-gray-900">
                                    {selectedAccount === 'all'
                                        ? 'All accounts'
                                        : accounts.find(acc => acc.id === selectedAccount)?.accountClass || 'Select account'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>

                            {showAccountPicker && (
                                <View className="border border-gray-300 rounded-lg bg-white mb-4 overflow-hidden">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedAccount('all')
                                            setShowAccountPicker(false)
                                        }}
                                        className={`px-4 py-3 border-b border-gray-100 ${selectedAccount === 'all' ? 'bg-orange-50' : ''}`}
                                    >
                                        <Text className={selectedAccount === 'all' ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                                            All accounts
                                        </Text>
                                    </TouchableOpacity>
                                    {accounts.map(acc => (
                                        <TouchableOpacity
                                            key={acc.id}
                                            onPress={() => {
                                                setSelectedAccount(acc.id)
                                                setShowAccountPicker(false)
                                            }}
                                            className={`px-4 py-3 border-b border-gray-100 ${selectedAccount === acc.id ? 'bg-orange-50' : ''}`}
                                        >
                                            <Text className={selectedAccount === acc.id ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                                                {acc.accountClass} - {acc.platform} ({acc.login})
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <Text className="text-sm font-medium text-gray-700 mb-2">Time Period</Text>
                            <TouchableOpacity
                                onPress={() => setShowDaysPicker(!showDaysPicker)}
                                className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between"
                            >
                                <Text className="text-gray-900">
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
                                        >
                                            <Text className={selectedDays === filter.value ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                                                {filter.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Stats Grid */}
                        <View className="mb-6">
                            <MainStatCard
                                label="Net Profit"
                                value={formatCurrency(stats.netProfit)}
                                subStats={[
                                    { label: 'Total Profit', value: formatCurrency(stats.totalProfit) },
                                    { label: 'Total Loss', value: formatCurrency(stats.totalLoss) },
                                ]}
                                valueColor={stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}
                            />
                            <MainStatCard
                                label="Balance & Equity"
                                value={formatCurrency(stats.totalBalance)}
                                subStats={[
                                    { label: 'Equity', value: formatCurrency(stats.equity) },
                                    { label: 'Free Margin', value: formatCurrency(stats.freeMargin) },
                                ]}
                                valueColor="text-blue-600"
                            />
                            <MainStatCard
                                label="Closed Orders"
                                value={stats.closedOrders.toString()}
                                subStats={[
                                    { label: 'Profitable', value: stats.profitableOrders.toString() },
                                    { label: 'Unprofitable', value: stats.unprofitableOrders.toString() },
                                ]}
                                valueColor="text-gray-900"
                            />
                            <MainStatCard
                                label="Trading Volume"
                                value={formatCurrency(stats.tradingVolume)}
                                subStats={[
                                    { label: 'Lifetime Volume', value: formatCurrency(stats.lifetimeTradingVolume) },
                                ]}
                                valueColor="text-purple-600"
                            />
                        </View>

                        {/* Charts */}
                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                            <Text className="text-lg font-bold text-gray-900 mb-4">Charts</Text>

                            {/* Chart Tabs */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                <View className="flex-row gap-2">
                                    {CHART_TABS.map(tab => (
                                        <TouchableOpacity
                                            key={tab.id}
                                            onPress={() => setActiveChartTab(tab.id)}
                                            className={`px-4 py-2 rounded-lg ${activeChartTab === tab.id ? 'bg-orange-500' : 'bg-gray-100'
                                                }`}
                                        >
                                            <Text
                                                className={`font-semibold ${activeChartTab === tab.id ? 'text-white' : 'text-gray-600'
                                                    }`}
                                            >
                                                {tab.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Chart Display */}
                            {renderChart()}
                        </View>

                        <View className="h-6" />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

// Main Stat Card Component
const MainStatCard = ({ label, value, subStats = [], valueColor = 'text-gray-900' }) => (
    <View className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
        <Text className="text-gray-500 text-xs font-medium mb-2">{label}</Text>
        <Text className={`text-2xl font-bold ${valueColor} mb-4`}>{value}</Text>
        <View>
            {subStats.map((sub, idx) => (
                <View key={idx} className="flex-row justify-between items-center mb-1">
                    <Text className="text-gray-500 text-sm">{sub.label}</Text>
                    <Text className="text-gray-900 font-medium text-sm">{sub.value}</Text>
                </View>
            ))}
        </View>
    </View>
)

export default Performance
