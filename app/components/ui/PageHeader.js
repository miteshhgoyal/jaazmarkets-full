import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/context/authContext';
import Button from './Button';

const PageHeader = ({
    title,
    subtitle,
    showButton = false,
    buttonText = 'Button',
    buttonIcon: ButtonIcon,
    onButtonClick,
    actions,
    className = '',
}) => {
    const { isDarkMode } = useAuth();

    return (
        <View className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b rounded-lg ${className}`}>
            <View className="px-4 py-4">
                <View className="flex-col gap-4">
                    {/* Title and description */}
                    <View className="flex-1">
                        {title && (
                            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {subtitle}
                            </Text>
                        )}
                    </View>

                    {/* Actions */}
                    {(actions || showButton) && (
                        <View className="flex-row items-center gap-3">
                            {actions && <View className="flex-row items-center gap-2">{actions}</View>}

                            {showButton && (
                                <Button
                                    onPress={onButtonClick}
                                    size="md"
                                    className="flex-row items-center gap-2 shadow-lg"
                                >
                                    <View className="flex-row items-center gap-2">
                                        {ButtonIcon && <ButtonIcon size={18} color="#ffffff" />}
                                        <Text className="text-gray-100 text-base font-medium">{buttonText}</Text>
                                    </View>
                                </Button>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default PageHeader;
