import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useAuth } from '@/context/authContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AlertModal = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'OK',
    cancelText = 'Cancel',
    type = 'info',
    icon,
    allowBackgroundClose = true, // New prop to control background tap
    showCrossIcon = true // New prop to control cross icon visibility
}) => {
    const { isDarkMode } = useAuth();

    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return { color: '#10b981', icon: 'checkmark-circle' };
            case 'warning':
                return { color: '#f59e0b', icon: 'warning' };
            case 'error':
                return { color: '#ef4444', icon: 'close-circle' };
            default:
                return { color: '#f97316', icon: 'information-circle' };
        }
    };

    const typeConfig = getTypeConfig();

    // Close modal handler
    const handleClose = () => {
        if (onCancel) {
            onCancel();
        } else if (onConfirm) {
            // If no onCancel provided, fallback to onConfirm
            onConfirm();
        }
    };

    // Handle confirm and close
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    // Handle background press
    const handleBackgroundPress = () => {
        if (allowBackgroundClose) {
            handleClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType='fade'>
            <View className="flex-1 bg-black/60 justify-center items-center px-5">
                {/* Backdrop - tap to close */}
                <Pressable
                    className="absolute inset-0"
                    onPress={handleBackgroundPress}
                />

                <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-3xl p-6 w-full max-w-sm shadow-2xl relative`}>

                    {/* Cross Icon - ALWAYS visible (top right) */}
                    {showCrossIcon && (
                        <Pressable
                            className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center z-10"
                            style={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                            onPress={handleClose}
                        >
                            <Ionicons
                                name="close"
                                size={18}
                                color={isDarkMode ? '#9ca3af' : '#6b7280'}
                            />
                        </Pressable>
                    )}

                    {/* Icon */}
                    <View className="items-center mb-4">
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: typeConfig.color + '20' }}
                        >
                            <Ionicons
                                name={icon || typeConfig.icon}
                                size={32}
                                color={typeConfig.color}
                            />
                        </View>
                    </View>

                    {/* Title */}
                    {title && (
                        <Text className={`text-lg font-bold text-center mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {title}
                        </Text>
                    )}

                    {/* Message */}
                    <Text className={`text-base text-center mb-6 leading-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {message}
                    </Text>

                    {/* Buttons */}
                    <View className={`${onCancel ? 'flex-row' : 'flex-col'} gap-3`}>
                        {onCancel && (
                            <Pressable
                                className="flex-1 bg-gray-500 px-5 py-3 rounded-lg"
                                onPress={onCancel}
                            >
                                <Text className="text-gray-100 font-semibold text-center">
                                    {cancelText}
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            className="flex-1 rounded-lg overflow-hidden"
                            onPress={handleConfirm}
                        >
                            <LinearGradient
                                colors={[typeConfig.color, typeConfig.color]}
                                className="px-5 py-3 items-center"
                            >
                                <Text className="text-gray-100 font-semibold text-base">
                                    {confirmText}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AlertModal;
