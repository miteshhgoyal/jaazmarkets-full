import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';

const ArchivedAccountCard = ({ account, onReactivate }) => {
    const { theme } = useTheme();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <View
            className="rounded-lg overflow-hidden opacity-60"
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
                <View className="flex-row items-center justify-between mb-4">
                    {/* Badges */}
                    <View className="flex-row flex-wrap gap-2">
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

                    {/* Date */}
                    <View className="flex-row items-center gap-1.5">
                        <Ionicons name="calendar-outline" size={12} color={theme.textTertiary} />
                        <Text
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                        >
                            {formatDate(account.archivedDate)}
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
                        className="text-2xl font-bold"
                        style={{ color: theme.textPrimary }}
                    >
                        {account.currency} {account.balance.toLocaleString()}
                    </Text>
                </View>

                {/* Reactivate Button */}
                <TouchableOpacity
                    onPress={() => onReactivate(account.id)}
                    className="mt-4 py-3.5 rounded-lg flex-row items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                >
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text className="text-white font-bold ml-2">Reactivate Account</Text>
                </TouchableOpacity>
            </View>

            {/* Archive Reason */}
            <View className="p-5">
                <View
                    className="rounded-lg p-4 flex-row items-start gap-3"
                    style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 1,
                        borderColor: 'rgba(245, 158, 11, 0.2)'
                    }}
                >
                    <Ionicons name="alert-circle" size={18} color="#f59e0b" />
                    <View className="flex-1">
                        <Text className="text-sm font-medium mb-1" style={{ color: '#fcd34d' }}>
                            {account.archiveReason || 'Account archived due to inactivity'}
                        </Text>
                        <Text className="text-xs" style={{ color: '#fbbf24' }}>
                            Archived on {formatDate(account.archivedDate)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ArchivedAccountCard;
