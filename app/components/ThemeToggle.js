import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';

const ThemeToggle = ({ size = 24, style = {} }) => {
    const { isDarkMode, toggleTheme, theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={[{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.cardBg,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.borderPrimary,
            }, style]}
        >
            <Ionicons
                name={isDarkMode ? 'sunny' : 'moon'}
                size={size}
                color={theme.primary}
            />
        </TouchableOpacity>
    );
};

export default ThemeToggle;
