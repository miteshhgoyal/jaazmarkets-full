import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';

const ActiveAccountCard = ({ account, onTrade }) => {
    const { theme } = useTheme();

    const stats = [
        { label: 'Equity', value: `${account.currency} ${account.equity?.toLocaleString()}` },
        { label: 'Margin', value: `${account.currency} ${account.margin?.toLocaleString()}` },
        { label: 'Free Margin', value: `${account.currency} ${account.freeMargin?.toLocaleString()}` },
        { label: 'Margin Level', value: `${account.marginLevel}%` },
    ];

    return (
        <View
            className="rounded-lg overflow-hidden"
            style={{
                backgroundColor: theme.cardBg,
                borderWidth: 1,
                borderColor: theme.borderPrimary
            }}
        >
            {/* Header Section */}
            <View
                className="p-5 border-b"
                style={{ borderColor: theme.borderPrimary }}
            >
                {/* Badges */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                    <View
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        <Text className="text-xs font-bold" style={{ color: '#10b981' }}>
                            {account.platform}
                        </Text>
                    </View>
                    <View
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(168, 85, 247, 0.2)'
                        }}
                    >
                        <Text className="text-xs font-bold" style={{ color: '#a855f7' }}>
                            {account.accountClass}
                        </Text>
                    </View>
                </View>

                {/* Balance Display */}
                <View>
                    <Text
                        className="text-xs uppercase tracking-wide mb-1.5 font-semibold"
                        style={{ color: theme.textTertiary }}
                    >
                        Balance
                    </Text>
                    <Text
                        className="text-3xl font-bold"
                        style={{ color: theme.textPrimary }}
                    >
                        {account.currency} {account.balance.toLocaleString()}
                    </Text>
                </View>

                {/* Trade Button */}
                <TouchableOpacity
                    onPress={() => onTrade(account.id)}
                    className="mt-4 py-3.5 rounded-lg flex-row items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                >
                    <Ionicons name="trending-up" size={18} color="#fff" />
                    <Text className="text-white font-bold ml-2">Start Trading</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Stats Section */}
            <View className="p-5">
                <View className="space-y-3">
                    {stats.map((stat, index) => (
                        <View key={index} className="flex-row justify-between items-center">
                            <Text
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                            >
                                {stat.label}
                            </Text>
                            <Text
                                className="font-semibold"
                                style={{ color: theme.textPrimary }}
                            >
                                {stat.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Trading Info Section */}
            <View className="p-5 pt-0">
                <View
                    className="rounded-lg p-4"
                    style={{ backgroundColor: theme.inputBg }}
                >
                    <Text
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: theme.textTertiary }}
                    >
                        Trading Details
                    </Text>
                    <View className="space-y-2.5">
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                            >
                                Leverage
                            </Text>
                            <Text
                                className="font-bold"
                                style={{ color: theme.textPrimary }}
                            >
                                {account.leverage}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                            >
                                Spread
                            </Text>
                            <Text
                                className="font-medium"
                                style={{ color: theme.textPrimary }}
                            >
                                {account.spreadType}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                            >
                                Commission
                            </Text>
                            <Text
                                className="font-medium"
                                style={{ color: theme.textPrimary }}
                            >
                                {account.commission}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ActiveAccountCard;
