import React from 'react';
import { View, Text } from 'react-native';

const AccountStats = ({ account }) => {
    const stats = [
        { label: 'Equity', value: `${account.currency} ${account.equity?.toLocaleString()}` },
        { label: 'Margin', value: `${account.currency} ${account.margin?.toLocaleString()}` },
        { label: 'Free Margin', value: `${account.currency} ${account.freeMargin?.toLocaleString()}` },
        { label: 'Margin Level', value: `${account.marginLevel}%` },
    ];

    return (
        <View className="space-y-3">
            {stats.map((stat, index) => (
                <View key={index} className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-400">{stat.label}</Text>
                    <Text className="font-semibold text-gray-100">{stat.value}</Text>
                </View>
            ))}
        </View>
    );
};

export default AccountStats;
