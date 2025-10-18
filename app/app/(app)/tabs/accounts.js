import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/themeContext';
import { useDataFilter } from '@/hooks/useDataFilter';
import ActiveAccountCard from '@/components/accounts/ActiveAccountCard';
import ArchivedAccountCard from '@/components/accounts/ArchivedAccountCard';
import api from '../../../services/api';

const AccountsScreen = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('Real');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch accounts
    const fetchAccounts = async () => {
        try {
            setError(null);
            const response = await api.get('/trading/accounts');
            setAccounts(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load accounts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Filter accounts by tab
    const tabFilteredAccounts = accounts.filter(
        (account) => account.accountType === activeTab
    );

    // Generic filtering configuration
    const filterConfig = {
        searchConfig: {
            fields: ['_id', 'platform', 'accountClass', 'server'],
            type: 'contains',
        },
        sortConfig: {
            options: {
                newest: { field: 'createdAt', type: 'date', direction: 'desc' },
                oldest: { field: 'createdAt', type: 'date', direction: 'asc' },
                'balance-high': { field: 'balance', type: 'number', direction: 'desc' },
                'balance-low': { field: 'balance', type: 'number', direction: 'asc' },
            },
        },
        filterConfig: {
            platform: { field: 'platform', type: 'exact' },
            accountClass: { field: 'accountClass', type: 'exact' },
            status: { field: 'status', type: 'exact' },
        },
        initialSort: 'newest',
        initialFilters: {},
        debounceMs: 300,
    };

    // Use generic filter hook
    const {
        data: filteredAccounts,
        searchTerm,
        setSearchTerm,
        clearFilters,
        hasActiveFilters,
        totalCount,
        filteredCount,
    } = useDataFilter({
        data: tabFilteredAccounts,
        ...filterConfig,
    });

    const handleTrade = (accountId) => {
        router.push(`/trading/${accountId}`);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAccounts();
        setRefreshing(false);
    };

    // Reactivate archived account
    const handleReactivate = async (accountId) => {
        try {
            await api.patch(`/api/trading/accounts/${accountId}`, {
                accountType: 'Real',
                status: 'active',
            });
            fetchAccounts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reactivate account');
        }
    };

    // Get counts for tabs
    const realCount = accounts.filter((a) => a.accountType === 'Real').length;
    const demoCount = accounts.filter((a) => a.accountType === 'Demo').length;
    const archivedCount = accounts.filter((a) => a.accountType === 'Archived').length;

    const accountTabs = [
        { id: 'Real', label: 'Real', count: realCount },
        { id: 'Demo', label: 'Demo', count: demoCount },
        { id: 'Archived', label: 'Archived', count: archivedCount },
    ];

    return (
        <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
            <SafeAreaView edges={['top']} className="flex-1">
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
                    {/* Header */}
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text
                                    className="text-3xl font-bold mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Accounts
                                </Text>

                            </View>
                            <TouchableOpacity
                                onPress={() => router.push('/new-account')}
                                className="p-1.5 rounded-full"
                                style={{ backgroundColor: theme.primary }}
                            >
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="add" size={18} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="px-5 mt-5">
                        <View
                            className="pb-3 flex-row border-b border-gray-300"
                        >
                            {accountTabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                >
                                    <Text
                                        className={`text-center text-sm font-semibold mr-6 ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-600'}`}

                                    >
                                        {tab.label} {tab.count > 0 && `(${tab.count})`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="px-5 mt-5">
                        <View
                            className="rounded-lg px-4 py-3.5 flex-row items-center"
                            style={{
                                backgroundColor: theme.inputBg,
                                borderWidth: 1,
                                borderColor: theme.inputBorder
                            }}
                        >
                            <Ionicons name="search" size={20} color={theme.textTertiary} />
                            <TextInput
                                placeholder="Search accounts..."
                                placeholderTextColor={theme.textTertiary}
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                className="flex-1 ml-3 text-base"
                                style={{ color: theme.textPrimary }}
                            />
                            {searchTerm.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchTerm('')}>
                                    <Ionicons name="close" size={18} color={theme.textTertiary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Results Summary */}
                    {filteredCount !== totalCount && (
                        <View className="px-5 mt-4">
                            <View className="flex-row items-center justify-between">
                                <Text
                                    className="text-sm"
                                    style={{ color: theme.textSecondary }}
                                >
                                    Showing {filteredCount} of {totalCount}
                                </Text>
                                {hasActiveFilters && (
                                    <TouchableOpacity
                                        onPress={clearFilters}
                                        className="flex-row items-center gap-1"
                                    >
                                        <Ionicons name="close" size={14} color={theme.textTertiary} />
                                        <Text
                                            className="text-sm"
                                            style={{ color: theme.textSecondary }}
                                        >
                                            Clear
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Content */}
                    <View className="px-5 mt-5 pb-8">
                        {loading && (
                            <View className="py-20">
                                <Text
                                    className="text-center"
                                    style={{ color: theme.textTertiary }}
                                >
                                    Loading accounts...
                                </Text>
                            </View>
                        )}

                        {error && (
                            <View className="py-20">
                                <Text className="text-center text-red-500">Error: {error}</Text>
                                <TouchableOpacity onPress={fetchAccounts} className="mt-4">
                                    <Text
                                        className="text-center"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        Retry
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!loading && !error && (
                            <View className="space-y-4">
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
                                                onTrade={() => handleTrade(account._id)}
                                            />
                                        )}
                                    </View>
                                ))}

                                {filteredAccounts.length === 0 && !loading && (
                                    <View
                                        className="rounded-lg p-12 items-center"
                                        style={{ backgroundColor: theme.cardBg }}
                                    >
                                        <Text
                                            className="text-xl font-bold mb-2"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            No accounts found
                                        </Text>
                                        <Text
                                            className="text-center mb-8"
                                            style={{ color: theme.textSecondary }}
                                        >
                                            {hasActiveFilters
                                                ? 'Try adjusting your search'
                                                : `Create your first ${activeTab.toLowerCase()} account`}
                                        </Text>
                                        {!hasActiveFilters && (
                                            <TouchableOpacity
                                                onPress={() => router.push('/new-account')}
                                                className="px-6 py-3 rounded-lg"
                                                style={{ backgroundColor: theme.primary }}
                                            >
                                                <Text className="text-white font-bold">Create Account</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AccountsScreen;
