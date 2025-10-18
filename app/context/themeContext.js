import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Centralized color definitions
export const lightTheme = {
    // Background colors
    bgPrimary: '#f0f0f0',
    bgSecondary: '#f0f0f0',
    bgCard: '#f9fafb',
    bgInput: '#f9fafb',

    // Text colors
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',

    // Border colors
    borderPrimary: '#e2e8f0',
    borderSecondary: '#cbd5e1',

    // Accent colors
    primary: '#FF7516',
    primaryDark: '#ff6600',

    // Status bar
    statusBarStyle: 'dark-content',

    // Component specific
    cardBg: 'rgba(249, 250, 251, 0.9)',
    inputBg: '#f1f5f9',
    inputBorder: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0.1,
};

export const darkTheme = {
    // Background colors
    bgPrimary: '#1f2937',
    bgSecondary: '#111827',
    bgCard: '#374151',
    bgInput: '#374151',

    // Text colors
    textPrimary: '#f9fafb',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',

    // Border colors
    borderPrimary: '#4b5563',
    borderSecondary: '#6b7280',

    // Accent colors
    primary: '#FF7516',
    primaryDark: '#ff6600',

    // Status bar
    statusBarStyle: 'light-content',

    // Component specific
    cardBg: 'rgba(55, 65, 81, 0.5)',
    inputBg: 'rgba(55, 65, 81, 0.5)',
    inputBorder: '#4b5563',
    shadowColor: '#000',
    shadowOpacity: 0.3,
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme_preference');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = !isDarkMode;
            setIsDarkMode(newTheme);
            await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
