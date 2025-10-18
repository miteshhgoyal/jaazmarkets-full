import React from 'react';
import { View } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { useAuth } from '@/context/authContext';

const Picker = ({ selectedValue, onValueChange, items, className = '' }) => {
    const { isDarkMode } = useAuth();

    return (
        <View
            className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} ${className}`}
        >
            <RNPicker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={{
                    color: isDarkMode ? '#fefefe' : '#0f172a',
                    backgroundColor: 'transparent',
                }}
                dropdownIconColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            >
                {items.map((item) => (
                    <RNPicker.Item key={item.value} label={item.label} value={item.value} />
                ))}
            </RNPicker>
        </View>
    );
};

export default Picker;
