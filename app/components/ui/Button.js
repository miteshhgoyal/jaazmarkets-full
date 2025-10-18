import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/authContext';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    onPress,
    ...props
}) => {
    const { isDarkMode } = useAuth();

    const baseClasses = 'rounded-lg items-center justify-center';

    const variants = {
        primary: 'bg-primary shadow-sm',
        secondary: isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200',
        outline: isDarkMode ? 'border-2 border-primary bg-transparent' : 'border-2 border-primary bg-gray-100',
        ghost: isDarkMode ? 'bg-transparent' : 'bg-transparent',
        success: 'bg-emerald-500 shadow-sm',
        warning: 'bg-amber-500 shadow-sm',
        danger: 'bg-red-500 shadow-sm',
    };

    const sizes = {
        xs: 'px-2 py-1',
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
        xl: 'px-8 py-5',
    };

    const textColors = {
        primary: 'text-gray-100',
        secondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
        outline: 'text-primary',
        ghost: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        success: 'text-gray-100',
        warning: 'text-gray-100',
        danger: 'text-gray-100',
    };

    const textSizes = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${(disabled || loading) ? 'opacity-50' : ''}`}
            disabled={disabled || loading}
            onPress={onPress}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#3b82f6' : '#ffffff'} />
            ) : (
                typeof children === 'string' ? (
                    <Text className={`${textColors[variant]} ${textSizes[size]} font-medium`}>
                        {children}
                    </Text>
                ) : (
                    children
                )
            )}
        </TouchableOpacity>
    );
};

export default Button;
