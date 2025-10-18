import React from 'react';
import { View } from 'react-native';
import { useAuth } from '@/context/authContext';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
    const { isDarkMode } = useAuth();

    const variants = {
        default: isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200',
        outlined: isDarkMode ? 'bg-gray-800 border-2 border-primary/20' : 'bg-gray-100 border-2 border-primary/20',
        ghost: isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100/50 border border-gray-100',
    };

    return (
        <View
            className={`rounded-lg ${variants[variant]} ${className} overflow-hidden`}
            {...props}
        >
            {children}
        </View>
    );
};

const CardHeader = ({ children, className = '' }) => {
    return <View className={`p-4 ${className}`}>{children}</View>;
};

const CardContent = ({ children, className = '' }) => {
    return <View className={`px-4 pb-4 ${className}`}>{children}</View>;
};

const CardFooter = ({ children, className = '' }) => {
    const { isDarkMode } = useAuth();
    return (
        <View className={`px-4 py-4 border-t rounded-b-xl ${isDarkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-100 bg-gray-50/30'} ${className}`}>
            {children}
        </View>
    );
};

export default Card;
export { Card, CardHeader, CardContent, CardFooter };
