import React from 'react';
import { View, Text } from 'react-native';

const BalanceDisplay = ({ balance, currency, size = 'large' }) => {
    const textSize = size === 'large' ? 'text-3xl' : 'text-2xl';

    return (
        <View>
            <Text className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-semibold">
                Balance
            </Text>
            <Text className={`${textSize} font-bold text-gray-100`}>
                {currency} {balance.toLocaleString()}
            </Text>
        </View>
    );
};

export default BalanceDisplay;
