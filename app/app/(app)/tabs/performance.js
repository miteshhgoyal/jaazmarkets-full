import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
import api from '../../../services/api';

// Calculate comprehensive performance statistics
const getPerformanceStats = (accounts, dateFilter) => {
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
            winRate: 0,
            profitFactor: 0,
            averageWin: 0,
            averageLoss: 0,
            returnOnInvestment: 0,
            riskRewardRatio: 0,
            expectancy: 0,
            totalBalance: 0,
            totalFreeMargin: 0,
        };
    }

    const now = new Date();
    const filtered = accounts.filter((acc) => {
        if (!dateFilter) return true;
        const createdAt = new Date(acc.createdAt);
        const diffDays = (now - createdAt) / (1000 * 3600 * 24);
        return diffDays <= dateFilter;
    });

    const totalProfit = filtered.reduce((sum, acc) => sum + parseFloat(acc.totalProfit || 0), 0);
    const totalLoss = filtered.reduce((sum, acc) => sum + parseFloat(acc.totalLoss || 0), 0);
    const netProfit = totalProfit - totalLoss;

    const profitableOrders = filtered.reduce((sum, acc) => sum + (parseInt(acc.profitableOrders) || 0), 0);
    const unprofitableOrders = filtered.reduce((sum, acc) => sum + (parseInt(acc.unprofitableOrders) || 0), 0);
    const closedOrders = profitableOrders + unprofitableOrders;

    const tradingVolume = filtered.reduce((sum, acc) => sum + parseFloat(acc.tradingVolume || 0), 0);
    const lifetimeTradingVolume = filtered.reduce((sum, acc) => sum + parseFloat(acc.lifetimeTradingVolume || 0), 0);

    const equity = filtered.reduce((sum, acc) => sum + parseFloat(acc.equity || 0), 0);
    const currentEquity = filtered.reduce((sum, acc) => sum + parseFloat(acc.currentEquity || 0), 0);
    const totalBalance = filtered.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalFreeMargin = filtered.reduce((sum, acc) => sum + parseFloat(acc.freeMargin || 0), 0);

    const winRate = closedOrders > 0 ? (profitableOrders / closedOrders) * 100 : 0;
    const profitFactor = totalLoss !== 0 ? totalProfit / Math.abs(totalLoss) : totalProfit > 0 ? Infinity : 0;
    const averageWin = profitableOrders > 0 ? totalProfit / profitableOrders : 0;
    const averageLoss = unprofitableOrders > 0 ? Math.abs(totalLoss) / unprofitableOrders : 0;

    const returnOnInvestment = totalBalance > 0 ? (netProfit / totalBalance) * 100 : 0;
    const riskRewardRatio = averageLoss !== 0 ? averageWin / averageLoss : 0;
    const expectancy = closedOrders > 0 ? netProfit / closedOrders : 0;

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
        winRate,
        profitFactor,
        averageWin,
        averageLoss,
        returnOnInvestment,
        riskRewardRatio,
        expectancy,
        totalBalance,
        totalFreeMargin,
    };
};

const DAY_FILTERS = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 365 days', value: 365 },
    { label: 'All Time', value: null },
];

const PerformanceScreen = () => {
    const { theme } = useTheme();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [selectedDays, setSelectedDays] = useState(365);

    // Fetch all user accounts
    const fetchAccounts = async () => {
        try {
            setError(null);
            const response = await api.get('/trading/accounts');
            const allAccounts = response.data.data || [];
            setAccounts(allAccounts);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load accounts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const filteredAccounts = useMemo(() => {
        if (selectedAccount === 'all') return accounts;
        return accounts.filter((acc) => acc._id === selectedAccount);
    }, [accounts, selectedAccount]);

    const stats = useMemo(
        () => getPerformanceStats(filteredAccounts, selectedDays),
        [filteredAccounts, selectedDays]
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAccounts();
        setRefreshing(false);
    };

    // Get account badge color based on type
    const getAccountBadgeColor = (accountType) => {
        switch (accountType) {
            case 'Real':
                return { bg: '#dcfce7', text: '#16a34a', border: '#86efac' };
            case 'Demo':
                return { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' };
            case 'Archived':
                return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
            default:
                return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
        }
    };

    // Get platform icon
    const getPlatformIcon = (platform) => {
        return platform === 'MT5' ? 'terminal' : 'desktop';
    };

    if (loading) {
        return (
            <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
                <SafeAreaView edges={['top']} className="flex-1">
                    <View
                        className="px-5 pt-4 pb-6 border-b"
                        style={{
                            backgroundColor: theme.bgPrimary,
                            borderColor: theme.borderPrimary
                        }}
                    >
                        <Text className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                            Performance
                        </Text>
                        <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                            Analyze your trading metrics
                        </Text>
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <Text style={{ color: theme.textSecondary }}>Loading accounts...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
                <SafeAreaView edges={['top']} className="flex-1">
                    <View
                        className="px-5 pt-4 pb-6 border-b"
                        style={{
                            backgroundColor: theme.bgPrimary,
                            borderColor: theme.borderPrimary
                        }}
                    >
                        <Text className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                            Performance
                        </Text>
                        <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                            Analyze your trading metrics
                        </Text>
                    </View>
                    <View className="flex-1 justify-center items-center px-5">
                        <Ionicons name="alert-circle" size={48} color="#ef4444" />
                        <Text className="text-red-500 text-center mt-3">{error}</Text>
                        <TouchableOpacity
                            onPress={fetchAccounts}
                            className="mt-4 px-6 py-3 rounded-lg"
                            style={{ backgroundColor: theme.primary }}
                        >
                            <Text className="text-white font-semibold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View
                    className="px-5 pt-4 pb-6 border-b"
                    style={{
                        backgroundColor: theme.bgPrimary,
                        borderColor: theme.borderPrimary
                    }}
                >
                    <Text className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                        Performance
                    </Text>
                    <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                        Analyze your trading metrics across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.primary}
                        />
                    }
                >
                    {/* Account Filters */}
                    <View className="px-5 mt-6">
                        <Text
                            className="text-sm font-semibold uppercase tracking-wide mb-3"
                            style={{ color: theme.textTertiary }}
                        >
                            Select Account
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-2">
                                <AccountFilterPill
                                    label="All Accounts"
                                    sublabel={`${accounts.length} total`}
                                    icon="albums"
                                    active={selectedAccount === 'all'}
                                    onPress={() => setSelectedAccount('all')}
                                    theme={theme}
                                />
                                {accounts.map((acc) => {
                                    const badgeColor = getAccountBadgeColor(acc.accountType);
                                    return (
                                        <AccountFilterPill
                                            key={acc._id}
                                            label={`${acc.platform} ${acc.accountClass}`}
                                            sublabel={`${acc.accountType} • ${acc.leverage || '1:1000'}`}
                                            icon={getPlatformIcon(acc.platform)}
                                            badge={acc.accountType}
                                            badgeColor={badgeColor}
                                            active={selectedAccount === acc._id}
                                            onPress={() => setSelectedAccount(acc._id)}
                                            theme={theme}
                                        />
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Time Filter */}
                    <View className="px-5 mt-4">
                        <Text
                            className="text-sm font-semibold uppercase tracking-wide mb-3"
                            style={{ color: theme.textTertiary }}
                        >
                            Time Period
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-2">
                                {DAY_FILTERS.map((filter) => (
                                    <FilterPill
                                        key={filter.value}
                                        label={filter.label}
                                        active={selectedDays === filter.value}
                                        onPress={() => setSelectedDays(filter.value)}
                                        theme={theme}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {accounts.length === 0 ? (
                        <View className="flex-1 justify-center items-center py-20">
                            <Ionicons name="trending-down" size={64} color={theme.textTertiary} />
                            <Text className="mt-4 text-lg font-semibold" style={{ color: theme.textSecondary }}>
                                No accounts found
                            </Text>
                            <Text className="mt-2 text-center px-10" style={{ color: theme.textTertiary }}>
                                Add your first trading account to start tracking performance
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* Main Summary Cards - 4 Cards Grid */}
                            <View className="px-5 mt-6">
                                <Text
                                    className="text-sm font-semibold uppercase tracking-wide mb-3"
                                    style={{ color: theme.textTertiary }}
                                >
                                    Summary
                                </Text>

                                <MainStatCard
                                    label="Net Profit"
                                    value={`$${stats.netProfit.toFixed(2)}`}
                                    subStats={[
                                        { label: 'Total Profit', value: `$${stats.totalProfit.toFixed(2)}` },
                                        { label: 'Total Loss', value: `$${Math.abs(stats.totalLoss).toFixed(2)}` },
                                    ]}
                                    valueColor={stats.netProfit >= 0 ? '#10b981' : '#ef4444'}
                                    icon={stats.netProfit >= 0 ? 'trending-up' : 'trending-down'}
                                    theme={theme}
                                />

                                <MainStatCard
                                    label="Closed Orders"
                                    value={stats.closedOrders.toString()}
                                    subStats={[
                                        { label: 'Profitable', value: stats.profitableOrders },
                                        { label: 'Unprofitable', value: stats.unprofitableOrders },
                                    ]}
                                    valueColor={theme.textPrimary}
                                    icon="list"
                                    theme={theme}
                                />

                                <MainStatCard
                                    label="Trading Volume"
                                    value={`$${stats.tradingVolume.toFixed(2)}`}
                                    subStats={[
                                        { label: 'Lifetime Volume', value: `$${stats.lifetimeTradingVolume.toFixed(2)}` },
                                    ]}
                                    valueColor={theme.textPrimary}
                                    icon="stats-chart"
                                    theme={theme}
                                />

                                <MainStatCard
                                    label="Account Equity"
                                    value={`$${stats.equity.toFixed(2)}`}
                                    subStats={[
                                        { label: 'Current Equity', value: `$${stats.currentEquity.toFixed(2)}` },
                                        { label: 'Free Margin', value: `$${stats.totalFreeMargin.toFixed(2)}` },
                                    ]}
                                    valueColor={theme.textPrimary}
                                    icon="wallet"
                                    theme={theme}
                                />
                            </View>

                            {/* Key Performance Metrics */}
                            <View className="px-5 mt-6">
                                <Text
                                    className="text-sm font-semibold uppercase tracking-wide mb-3"
                                    style={{ color: theme.textTertiary }}
                                >
                                    Key Metrics
                                </Text>
                                <View className="space-y-3">
                                    <MetricCard
                                        icon="analytics"
                                        label="Win Rate"
                                        value={`${stats.winRate.toFixed(1)}%`}
                                        valueColor={stats.winRate >= 50 ? '#10b981' : '#ef4444'}
                                        subMetrics={[
                                            { label: 'Winning Trades', value: stats.profitableOrders },
                                            { label: 'Losing Trades', value: stats.unprofitableOrders },
                                        ]}
                                        theme={theme}
                                    />
                                    <MetricCard
                                        icon="analytics"
                                        label="Profit Factor"
                                        value={
                                            stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)
                                        }
                                        valueColor={
                                            stats.profitFactor >= 1.5
                                                ? '#10b981'
                                                : stats.profitFactor >= 1
                                                    ? '#f59e0b'
                                                    : '#ef4444'
                                        }
                                        subMetrics={[
                                            { label: 'Avg Win', value: `$${stats.averageWin.toFixed(2)}` },
                                            { label: 'Avg Loss', value: `$${stats.averageLoss.toFixed(2)}` },
                                        ]}
                                        theme={theme}
                                    />
                                    <MetricCard
                                        icon="trending-up"
                                        label="Return on Investment"
                                        value={`${stats.returnOnInvestment >= 0 ? '+' : ''}${stats.returnOnInvestment.toFixed(2)}%`}
                                        valueColor={stats.returnOnInvestment >= 0 ? '#10b981' : '#ef4444'}
                                        subMetrics={[
                                            { label: 'Total Balance', value: `$${stats.totalBalance.toFixed(2)}` },
                                            { label: 'Expectancy', value: `$${stats.expectancy.toFixed(2)}` },
                                        ]}
                                        theme={theme}
                                    />
                                </View>
                            </View>

                            {/* Risk Management */}
                            <View className="px-5 mt-6 mb-8">
                                <Text
                                    className="text-sm font-semibold uppercase tracking-wide mb-3"
                                    style={{ color: theme.textTertiary }}
                                >
                                    Risk Management
                                </Text>
                                <View
                                    className="rounded-lg p-5"
                                    style={{
                                        backgroundColor: theme.cardBg,
                                        borderWidth: 1,
                                        borderColor: theme.borderPrimary
                                    }}
                                >
                                    <View className="space-y-4">
                                        <StatRow
                                            label="Risk/Reward Ratio"
                                            value={stats.riskRewardRatio.toFixed(2)}
                                            valueColor={
                                                stats.riskRewardRatio >= 2
                                                    ? '#10b981'
                                                    : stats.riskRewardRatio >= 1
                                                        ? '#f59e0b'
                                                        : '#ef4444'
                                            }
                                            icon="shield-checkmark"
                                            theme={theme}
                                        />
                                        <StatRow
                                            label="Average Win"
                                            value={`$${stats.averageWin.toFixed(2)}`}
                                            valueColor="#10b981"
                                            icon="arrow-up-circle"
                                            theme={theme}
                                        />
                                        <StatRow
                                            label="Average Loss"
                                            value={`$${stats.averageLoss.toFixed(2)}`}
                                            valueColor="#ef4444"
                                            icon="arrow-down-circle"
                                            theme={theme}
                                        />
                                        <StatRow
                                            label="Expectancy per Trade"
                                            value={`$${stats.expectancy.toFixed(2)}`}
                                            valueColor={stats.expectancy >= 0 ? '#10b981' : '#ef4444'}
                                            icon="calculator"
                                            theme={theme}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Account Details Section */}
                            {selectedAccount !== 'all' && filteredAccounts.length === 1 && (
                                <View className="px-5 mt-2 mb-8">
                                    <Text
                                        className="text-sm font-semibold uppercase tracking-wide mb-3"
                                        style={{ color: theme.textTertiary }}
                                    >
                                        Account Details
                                    </Text>
                                    <AccountDetailsCard account={filteredAccounts[0]} theme={theme} />
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

// Enhanced Account Filter Pill with badge and icon
const AccountFilterPill = ({ label, sublabel, icon, badge, badgeColor, active, onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        className="px-4 py-3 rounded-lg min-w-[160px]"
        style={{
            backgroundColor: active ? theme.primary : theme.cardBg,
            borderWidth: active ? 0 : 1,
            borderColor: theme.borderPrimary
        }}
    >
        <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-2">
                <Ionicons
                    name={icon}
                    size={16}
                    color={active ? '#fff' : theme.textSecondary}
                />
                <Text
                    className="text-sm font-semibold"
                    style={{ color: active ? '#fff' : theme.textPrimary }}
                >
                    {label}
                </Text>
            </View>
            {badge && !active && (
                <View
                    className="px-2 ml-1.5 py-0.5 rounded-full"
                    style={{
                        backgroundColor: badgeColor.bg,
                        borderWidth: 1,
                        borderColor: badgeColor.border
                    }}
                >
                    <Text
                        className="text-[10px] font-semibold"
                        style={{ color: badgeColor.text }}
                    >
                        {badge}
                    </Text>
                </View>
            )}
        </View>
        <Text
            className="text-xs"
            style={{ color: active ? 'rgba(255,255,255,0.8)' : theme.textTertiary }}
        >
            {sublabel}
        </Text>
    </TouchableOpacity>
);

// Simple Filter Pill Component
const FilterPill = ({ label, active, onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        className="px-4 py-2 rounded-lg"
        style={{
            backgroundColor: active ? theme.primary : theme.cardBg,
            borderWidth: active ? 0 : 1,
            borderColor: theme.borderPrimary
        }}
    >
        <Text
            className="text-sm font-medium"
            style={{ color: active ? '#fff' : theme.textSecondary }}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

// Main Stat Card Component with icon
const MainStatCard = ({ label, value, subStats = [], valueColor, icon, theme }) => (
    <View
        className="rounded-lg p-5 mb-3"
        style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.borderPrimary
        }}
    >
        <View className="flex-row items-center gap-2 mb-2">
            {icon && <Ionicons name={icon} size={16} color={theme.textTertiary} />}
            <Text
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: theme.textTertiary }}
            >
                {label}
            </Text>
        </View>
        <Text className="text-3xl font-bold mb-4" style={{ color: valueColor }}>
            {value}
        </Text>
        <View className="space-y-2">
            {subStats.map((sub, idx) => (
                <View key={idx} className="flex-row justify-between items-center">
                    <Text className="text-xs" style={{ color: theme.textTertiary }}>
                        {sub.label}
                    </Text>
                    <Text className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                        {sub.value}
                    </Text>
                </View>
            ))}
        </View>
    </View>
);

// Metric Card Component
const MetricCard = ({ icon, label, value, valueColor, subMetrics, theme }) => (
    <View
        className="rounded-lg p-5 mb-3"
        style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.borderPrimary
        }}
    >
        <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name={icon} size={18} color={theme.textTertiary} />
            <Text
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: theme.textTertiary }}
            >
                {label}
            </Text>
        </View>
        <Text className="text-3xl font-bold mb-4" style={{ color: valueColor }}>
            {value}
        </Text>
        <View className="space-y-2">
            {subMetrics.map((sub, idx) => (
                <View key={idx} className="flex-row justify-between items-center">
                    <Text className="text-xs" style={{ color: theme.textTertiary }}>
                        {sub.label}
                    </Text>
                    <Text className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                        {sub.value}
                    </Text>
                </View>
            ))}
        </View>
    </View>
);

// Stat Row Component
const StatRow = ({ label, value, valueColor, icon, theme }) => (
    <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
            {icon && <Ionicons name={icon} size={16} color={theme.textTertiary} />}
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
                {label}
            </Text>
        </View>
        <Text className="text-sm font-bold" style={{ color: valueColor || theme.textPrimary }}>
            {value}
        </Text>
    </View>
);

// Account Details Card - Shows detailed information about selected account
const AccountDetailsCard = ({ account, theme }) => {
    const badgeColor = {
        Real: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
        Demo: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
        Archived: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }
    }[account.accountType] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };

    const statusColor = {
        active: { bg: '#dcfce7', text: '#16a34a' },
        inactive: { bg: '#fee2e2', text: '#dc2626' },
        suspended: { bg: '#fef3c7', text: '#d97706' }
    }[account.status] || { bg: '#f3f4f6', text: '#6b7280' };

    return (
        <View
            className="rounded-lg p-5"
            style={{
                backgroundColor: theme.cardBg,
                borderWidth: 1,
                borderColor: theme.borderPrimary
            }}
        >
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                    <View
                        className="w-12 h-12 rounded-lg items-center justify-center"
                        style={{ backgroundColor: theme.primary + '20' }}
                    >
                        <Ionicons
                            name={account.platform === 'MT5' ? 'terminal' : 'desktop'}
                            size={24}
                            color={theme.primary}
                        />
                    </View>
                    <View>
                        <Text className="text-lg font-bold" style={{ color: theme.textPrimary }}>
                            {account.platform} {account.accountClass}
                        </Text>
                        <Text className="text-xs" style={{ color: theme.textTertiary }}>
                            Login: {account.login || 'N/A'}
                        </Text>
                    </View>
                </View>
                <View className="items-end gap-1">
                    <View
                        className="px-2 py-1 rounded"
                        style={{
                            backgroundColor: badgeColor.bg,
                            borderWidth: 1,
                            borderColor: badgeColor.border
                        }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: badgeColor.text }}
                        >
                            {account.accountType}
                        </Text>
                    </View>
                    <View
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: statusColor.bg }}
                    >
                        <Text
                            className="text-xs font-semibold capitalize"
                            style={{ color: statusColor.text }}
                        >
                            {account.status}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="space-y-3 mt-4">
                <DetailRow
                    label="Balance"
                    value={`$${parseFloat(account.balance || 0).toFixed(2)} ${account.currency}`}
                    icon="cash"
                    theme={theme}
                />
                <DetailRow
                    label="Equity"
                    value={`$${parseFloat(account.equity || 0).toFixed(2)}`}
                    icon="trending-up"
                    theme={theme}
                />
                <DetailRow
                    label="Free Margin"
                    value={`$${parseFloat(account.freeMargin || 0).toFixed(2)}`}
                    icon="wallet"
                    theme={theme}
                />
                <DetailRow
                    label="Floating P/L"
                    value={account.floatingPL || '0.00'}
                    icon="pulse"
                    valueColor={parseFloat(account.floatingPL || 0) >= 0 ? '#10b981' : '#ef4444'}
                    theme={theme}
                />
                <DetailRow
                    label="Margin Level"
                    value={account.marginLevel || 'N/A'}
                    icon="speedometer"
                    theme={theme}
                />
                <DetailRow
                    label="Leverage"
                    value={account.leverage || '1:1000'}
                    icon="resize"
                    theme={theme}
                />
                <DetailRow
                    label="Spread Type"
                    value={account.spreadType || 'Floating'}
                    icon="swap-horizontal"
                    theme={theme}
                />
                <DetailRow
                    label="Commission"
                    value={account.commission || '$7 per lot'}
                    icon="card"
                    theme={theme}
                />
            </View>
        </View>
    );
};

// Detail Row for Account Details
const DetailRow = ({ label, value, icon, valueColor, theme }) => (
    <View className="flex-row justify-between items-center py-2 border-b" style={{ borderColor: theme.borderPrimary }}>
        <View className="flex-row items-center gap-2">
            <Ionicons name={icon} size={16} color={theme.textTertiary} />
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
                {label}
            </Text>
        </View>
        <Text className="text-sm font-bold" style={{ color: valueColor || theme.textPrimary }}>
            {value}
        </Text>
    </View>
);

export default PerformanceScreen;
