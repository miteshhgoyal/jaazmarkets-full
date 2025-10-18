// app/(app)/edit-profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import api from '@/services/api';

const EditProfileScreen = () => {
    const { theme } = useTheme();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        country: '',
        address: '',
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const validateForm = () => {
        if (!formData.name || formData.name.trim().length < 3) {
            Alert.alert('Validation Error', 'Name must be at least 3 characters long');
            return false;
        }

        if (!formData.email || !formData.email.includes('@')) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return false;
        }

        if (!formData.country || formData.country.trim().length === 0) {
            Alert.alert('Validation Error', 'Country is required');
            return false;
        }

        if (formData.username && formData.username.trim().length < 3) {
            Alert.alert('Validation Error', 'Username must be at least 3 characters long');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        if (!hasChanges) {
            Alert.alert('No Changes', 'No changes were made to your profile');
            return;
        }

        setLoading(true);
        try {
            const response = await api.put('/auth/update-profile', {
                name: formData.name.trim(),
                username: formData.username.trim(),
                phone: formData.phone.trim(),
                country: formData.country.trim(),
                address: formData.address.trim(),
            });

            if (response.data.success) {
                await updateUser(response.data.user);
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to update profile. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            Alert.alert(
                'Unsaved Changes',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    { text: 'Stay', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => router.back() }
                ]
            );
        } else {
            router.back();
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View
                    className="px-5 pt-4 pb-6 border-b flex-row items-center justify-between"
                    style={{
                        backgroundColor: theme.bgPrimary,
                        borderColor: theme.borderPrimary
                    }}
                >
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={handleCancel}
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: theme.cardBg }}
                        >
                            <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                                Edit Profile
                            </Text>
                            <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                                Update your information
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Form Fields */}
                    <View className="px-5 mt-6">
                        <InputField
                            label="Full Name"
                            icon="person"
                            value={formData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            placeholder="Enter your full name"
                            theme={theme}
                            required
                        />

                        <InputField
                            label="Username"
                            icon="at"
                            value={formData.username}
                            onChangeText={(text) => handleInputChange('username', text.toLowerCase())}
                            placeholder="Enter username"
                            theme={theme}
                            autoCapitalize="none"
                        />

                        <InputField
                            label="Email"
                            icon="mail"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            theme={theme}
                            editable={false}
                            required
                        />

                        <InputField
                            label="Phone"
                            icon="call"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange('phone', text)}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                            theme={theme}
                        />

                        <InputField
                            label="Country"
                            icon="location"
                            value={formData.country}
                            onChangeText={(text) => handleInputChange('country', text)}
                            placeholder="Enter country"
                            theme={theme}
                            required
                        />

                        <InputField
                            label="Address"
                            icon="home"
                            value={formData.address}
                            onChangeText={(text) => handleInputChange('address', text)}
                            placeholder="Enter full address"
                            multiline
                            theme={theme}
                        />
                    </View>

                    {/* Save Button */}
                    <View className="px-5 mt-6 mb-8">
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={loading || !hasChanges}
                            className="rounded-lg p-5 items-center"
                            style={{
                                backgroundColor: theme.primary,
                                opacity: (loading || !hasChanges) ? 0.5 : 1
                            }}
                        >
                            <Text className="text-white text-base font-bold">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCancel}
                            disabled={loading}
                            className="rounded-lg p-5 items-center mt-3"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary,
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const InputField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    multiline,
    editable = true,
    required = false,
    autoCapitalize = 'sentences',
    theme
}) => (
    <View className="mb-5">
        <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name={icon} size={16} color={theme.textTertiary} />
            <Text className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                {label} {required && <Text style={{ color: theme.error }}>*</Text>}
            </Text>
        </View>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.textTertiary}
            keyboardType={keyboardType}
            multiline={multiline}
            editable={editable}
            autoCapitalize={autoCapitalize}
            className="rounded-lg px-4 py-4"
            style={{
                backgroundColor: theme.cardBg,
                borderWidth: 1,
                borderColor: theme.borderPrimary,
                color: theme.textPrimary,
                fontSize: 14,
                minHeight: multiline ? 80 : 50,
                textAlignVertical: multiline ? 'top' : 'center',
                opacity: editable ? 1 : 0.6
            }}
        />
    </View>
);

export default EditProfileScreen;
