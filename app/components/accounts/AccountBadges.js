import React from 'react';
import { View, Text } from 'react-native';

const AccountBadges = ({ account }) => {
    return (
        <View className="flex-row flex-wrap gap-2">

            <View className="px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Text className="text-emerald-400 text-xs font-bold">
                    {account.platform}
                </Text>
            </View>
            <View className="px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Text className="text-purple-400 text-xs font-bold">
                    {account.accountClass}
                </Text>
            </View>
        </View>
    );
};

export default AccountBadges;
