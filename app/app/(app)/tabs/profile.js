// app/(app)/tabs/profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import api from '@/services/api';

const ProfileScreen = () => {
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const { user, logout, updateUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/auth/verify');
            if (response.data.success) {
                setUserDetails(response.data.user);
                await updateUser(response.data.user);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await logout();
                        if (result.success) {
                            router.replace('/(auth)/login');
                        }
                    }
                }
            ]
        );
    };

    const displayUser = userDetails || user;

    if (loading) {
        return (
            <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
                <SafeAreaView edges={['top']} className="flex-1">
                    <View className="flex-1 justify-center items-center">
                        <Text style={{ color: theme.textSecondary }}>Loading profile...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const getVerificationColor = () => {
        if (displayUser?.isVerified) {
            return { bg: '#dcfce7', text: '#16a34a', icon: 'checkmark-circle' };
        }
        return { bg: '#fef3c7', text: '#d97706', icon: 'alert-circle' };
    };

    const verificationStatus = getVerificationColor();

    const calculateProfileCompletion = () => {
        const fields = [
            displayUser?.name,
            displayUser?.email,
            displayUser?.username,
            displayUser?.country,
            displayUser?.phone,
            displayUser?.address,
            displayUser?.profilePhoto,
            displayUser?.isEmailVerified,
        ];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    };

    const profileCompletion = calculateProfileCompletion();

    return (
        <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
            <SafeAreaView edges={['top']} className="flex-1">
                <View
                    className="px-5 pt-4 pb-6 border-b"
                    style={{
                        backgroundColor: theme.bgPrimary,
                        borderColor: theme.borderPrimary
                    }}
                >
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                                Profile
                            </Text>
                            <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                                Manage your account settings
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={toggleTheme}
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: theme.cardBg }}
                        >
                            <Ionicons
                                name={isDarkMode ? 'sunny' : 'moon'}
                                size={20}
                                color={theme.textPrimary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.primary}
                        />
                    }
                >
                    {/* Profile Header Card */}
                    <View className="px-5 mt-6">
                        <View
                            className="rounded-lg p-6"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary
                            }}
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="relative">
                                    {displayUser?.profilePhoto ? (
                                        <Image
                                            source={{ uri: displayUser.profilePhoto }}
                                            className="w-20 h-20 rounded-full"
                                        />
                                    ) : (
                                        <View
                                            className="w-20 h-20 rounded-full items-center justify-center"
                                            style={{ backgroundColor: theme.primary + '20' }}
                                        >
                                            <Text
                                                className="text-3xl font-bold"
                                                style={{ color: theme.primary }}
                                            >
                                                {displayUser?.name?.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                    <View
                                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full items-center justify-center"
                                        style={{ backgroundColor: verificationStatus.bg }}
                                    >
                                        <Ionicons
                                            name={verificationStatus.icon}
                                            size={16}
                                            color={verificationStatus.text}
                                        />
                                    </View>
                                </View>

                                <View className="flex-1">
                                    <Text className="text-xl font-bold" style={{ color: theme.textPrimary }}>
                                        {displayUser?.name}
                                    </Text>
                                    <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                                        @{displayUser?.username}
                                    </Text>
                                    <View className="flex-row items-center gap-2 mt-2">
                                        <View
                                            className="px-2 py-1 rounded"
                                            style={{ backgroundColor: theme.primary + '20' }}
                                        >
                                            <Text
                                                className="text-xs font-semibold"
                                                style={{ color: theme.primary }}
                                            >
                                                {displayUser?.membershipId}
                                            </Text>
                                        </View>
                                        <View
                                            className="px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: displayUser?.role === 'admin' ? '#fef3c7' : '#e0e7ff'
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-semibold capitalize"
                                                style={{
                                                    color: displayUser?.role === 'admin' ? '#d97706' : '#6366f1'
                                                }}
                                            >
                                                {displayUser?.role}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => router.push('/edit-profile')}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    <Ionicons name="pencil" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View className="mt-5 pt-5 border-t" style={{ borderColor: theme.borderPrimary }}>
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                                        Profile Completion
                                    </Text>
                                    <Text className="text-xs font-bold" style={{ color: theme.primary }}>
                                        {profileCompletion}%
                                    </Text>
                                </View>
                                <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bgSecondary }}>
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: theme.primary,
                                            width: `${profileCompletion}%`
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Account Information */}
                    <View className="px-5 mt-6">
                        <Text
                            className="text-sm font-semibold uppercase tracking-wide mb-3"
                            style={{ color: theme.textTertiary }}
                        >
                            Account Information
                        </Text>
                        <View
                            className="rounded-lg overflow-hidden"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary
                            }}
                        >
                            <InfoRow
                                icon="mail"
                                label="Email"
                                value={displayUser?.email}
                                verified={displayUser?.isEmailVerified}
                                theme={theme}
                            />
                            <InfoRow
                                icon="call"
                                label="Phone"
                                value={displayUser?.phone || 'Not provided'}
                                theme={theme}
                            />
                            <InfoRow
                                icon="location"
                                label="Country"
                                value={displayUser?.country}
                                theme={theme}
                            />
                            <InfoRow
                                icon="home"
                                label="Address"
                                value={displayUser?.address || 'Not provided'}
                                theme={theme}
                                noBorder
                            />
                        </View>
                    </View>

                    {/* Verification Status */}
                    <View className="px-5 mt-6">
                        <Text
                            className="text-sm font-semibold uppercase tracking-wide mb-3"
                            style={{ color: theme.textTertiary }}
                        >
                            Verification Status
                        </Text>
                        <View
                            className="rounded-lg p-5"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-3">
                                    <View
                                        className="w-12 h-12 rounded-full items-center justify-center"
                                        style={{ backgroundColor: verificationStatus.bg }}
                                    >
                                        <Ionicons
                                            name={verificationStatus.icon}
                                            size={24}
                                            color={verificationStatus.text}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                                            {displayUser?.isVerified ? 'Verified Account' : 'Unverified Account'}
                                        </Text>
                                        <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>
                                            {displayUser?.completedSteps || 0} of 5 steps completed
                                        </Text>
                                    </View>
                                </View>
                                {!displayUser?.isVerified && (
                                    <TouchableOpacity
                                        onPress={() => router.push('/verification')}
                                        className="px-4 py-2 rounded-lg"
                                        style={{ backgroundColor: theme.primary }}
                                    >
                                        <Text className="text-white text-xs font-semibold">Verify</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View className="space-y-3">
                                <StatRow
                                    label="Deposit Limit"
                                    value={`$${displayUser?.depositLimit || 0}`}
                                    icon="wallet"
                                    theme={theme}
                                />
                                <StatRow
                                    label="Email Verified"
                                    value={displayUser?.isEmailVerified ? 'Yes' : 'No'}
                                    valueColor={displayUser?.isEmailVerified ? '#10b981' : '#ef4444'}
                                    icon="mail"
                                    theme={theme}
                                />
                                <StatRow
                                    label="Tax Agreement"
                                    value={displayUser?.agreeTax ? 'Accepted' : 'Pending'}
                                    valueColor={displayUser?.agreeTax ? '#10b981' : '#f59e0b'}
                                    icon="document-text"
                                    theme={theme}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Trading Accounts */}
                    <View className="px-5 mt-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text
                                className="text-sm font-semibold uppercase tracking-wide"
                                style={{ color: theme.textTertiary }}
                            >
                                Trading Accounts
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/tabs/accounts')}
                                className="flex-row items-center gap-1"
                            >
                                <Text className="text-xs font-semibold" style={{ color: theme.primary }}>
                                    View All
                                </Text>
                                <Ionicons name="chevron-forward" size={14} color={theme.primary} />
                            </TouchableOpacity>
                        </View>
                        <View
                            className="rounded-lg p-5"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary
                            }}
                        >
                            <View className="flex-row items-center justify-center gap-3">
                                <View
                                    className="w-16 h-16 rounded-full items-center justify-center"
                                    style={{ backgroundColor: theme.primary + '20' }}
                                >
                                    <Text className="text-2xl font-bold" style={{ color: theme.primary }}>
                                        {displayUser?.tradingAccounts?.length || 0}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                                        Active Accounts
                                    </Text>
                                    <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>
                                        Connected trading accounts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Referral Info */}
                    {displayUser?.partnerCode && (
                        <View className="px-5 mt-6">
                            <Text
                                className="text-sm font-semibold uppercase tracking-wide mb-3"
                                style={{ color: theme.textTertiary }}
                            >
                                Referral Information
                            </Text>
                            <View
                                className="rounded-lg p-5"
                                style={{
                                    backgroundColor: theme.cardBg,
                                    borderWidth: 1,
                                    borderColor: theme.borderPrimary
                                }}
                            >
                                <View className="flex-row items-center gap-3 mb-3">
                                    <Ionicons name="people" size={24} color={theme.primary} />
                                    <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                                        Partner Code
                                    </Text>
                                </View>
                                <View
                                    className="rounded-lg p-4"
                                    style={{ backgroundColor: theme.bgSecondary }}
                                >
                                    <Text
                                        className="text-2xl font-bold text-center tracking-wider"
                                        style={{ color: theme.primary }}
                                    >
                                        {displayUser.partnerCode}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Settings Menu */}
                    <View className="px-5 mt-6">
                        <Text
                            className="text-sm font-semibold uppercase tracking-wide mb-3"
                            style={{ color: theme.textTertiary }}
                        >
                            Settings
                        </Text>
                        <View
                            className="rounded-lg overflow-hidden"
                            style={{
                                backgroundColor: theme.cardBg,
                                borderWidth: 1,
                                borderColor: theme.borderPrimary
                            }}
                        >
                            <MenuButton
                                icon="person"
                                label="Edit Profile"
                                onPress={() => router.push('/edit-profile')}
                                theme={theme}
                            />
                            <MenuButton
                                icon="shield-checkmark"
                                label="Security Settings"
                                onPress={() => router.push('/security')}
                                theme={theme}
                            />
                            <MenuButton
                                icon="document-text"
                                label="Verification"
                                badge={displayUser?.isVerified ? null : 'Action Required'}
                                onPress={() => router.push('/verification')}
                                theme={theme}
                            />
                            <MenuButton
                                icon="notifications"
                                label="Notifications"
                                onPress={() => router.push('/notifications')}
                                theme={theme}
                            />
                            <MenuButton
                                icon="help-circle"
                                label="Help & Support"
                                onPress={() => router.push('/support')}
                                theme={theme}
                            />
                            <MenuButton
                                icon="information-circle"
                                label="About"
                                onPress={() => router.push('/about')}
                                theme={theme}
                                noBorder
                            />
                        </View>
                    </View>

                    {/* Account Actions */}
                    <View className="px-5 mt-6 mb-8">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="rounded-lg p-5 flex-row items-center justify-center gap-3"
                            style={{
                                backgroundColor: '#fee2e2',
                                borderWidth: 1,
                                borderColor: '#fecaca'
                            }}
                        >
                            <Ionicons name="log-out" size={20} color="#dc2626" />
                            <Text className="text-base font-bold" style={{ color: '#dc2626' }}>
                                Logout
                            </Text>
                        </TouchableOpacity>

                        <View className="mt-4 items-center">
                            <Text className="text-xs" style={{ color: theme.textTertiary }}>
                                Version 1.0.0
                            </Text>
                            <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>
                                Member since {new Date(displayUser?.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const InfoRow = ({ icon, label, value, verified, noBorder, theme }) => (
    <View
        className="flex-row items-center justify-between px-5 py-4"
        style={!noBorder && { borderBottomWidth: 1, borderColor: theme.borderPrimary }}
    >
        <View className="flex-row items-center gap-3 flex-1">
            <Ionicons name={icon} size={18} color={theme.textTertiary} />
            <View className="flex-1">
                <Text className="text-xs mb-1" style={{ color: theme.textTertiary }}>
                    {label}
                </Text>
                <Text className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                    {value}
                </Text>
            </View>
        </View>
        {verified && (
            <View
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{ backgroundColor: '#dcfce7' }}
            >
                <Ionicons name="checkmark" size={14} color="#16a34a" />
            </View>
        )}
    </View>
);

const StatRow = ({ label, value, valueColor, icon, theme }) => (
    <View className="flex-row justify-between items-center py-2">
        <View className="flex-row items-center gap-2">
            {icon && <Ionicons name={icon} size={16} color={theme.textTertiary} />}
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
                {label}
            </Text>
        </View>
        <Text className="text-sm font-bold" style={{ color: valueColor || theme.textPrimary }}>
            {value}
        </Text>
    </View>
);

const MenuButton = ({ icon, label, badge, onPress, noBorder, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between px-5 py-4"
        style={!noBorder && { borderBottomWidth: 1, borderColor: theme.borderPrimary }}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center gap-3">
            <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.bgSecondary }}
            >
                <Ionicons name={icon} size={20} color={theme.textPrimary} />
            </View>
            <Text className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                {label}
            </Text>
        </View>
        <View className="flex-row items-center gap-2">
            {badge && (
                <View
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: '#fef3c7' }}
                >
                    <Text className="text-xs font-semibold" style={{ color: '#d97706' }}>
                        {badge}
                    </Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </View>
    </TouchableOpacity>
);

export default ProfileScreen;
