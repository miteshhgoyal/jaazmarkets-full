import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'

const Security = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [securityData, setSecurityData] = useState(null)
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    useEffect(() => {
        fetchSecuritySettings()

        // Keyboard listeners
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        )
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    const fetchSecuritySettings = async () => {
        setFetchLoading(true)
        try {
            const response = await api.get('/user/security')
            if (response.data.success) {
                setSecurityData(response.data.data)
            } else {
                Alert.alert('Error', response.data.message)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load security settings'
            Alert.alert('Error', errorMsg)
            console.error('Fetch security settings error:', err)
        } finally {
            setFetchLoading(false)
        }
    }

    const passwordValidation = {
        length: newPassword.length >= 8 && newPassword.length <= 15,
        uppercase: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    }

    const isFormValid =
        currentPassword.length > 0 &&
        Object.values(passwordValidation).every(Boolean) &&
        newPassword === confirmPassword &&
        newPassword.length > 0

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }

        if (!Object.values(passwordValidation).every(Boolean)) {
            Alert.alert('Error', 'Please meet all password requirements')
            return
        }

        setLoading(true)
        try {
            const response = await api.post('/user/security/change-password', {
                currentPassword,
                newPassword,
                repeatPassword: confirmPassword,
            })

            if (response.data.success) {
                Alert.alert('Success', 'Password changed successfully')
                setShowPasswordForm(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                Alert.alert('Error', response.data.message)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to change password'
            Alert.alert('Error', errorMsg)
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading security settings...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 24,
                        paddingBottom: keyboardVisible ? 300 : 40
                    }}
                >
                    {/* Page Header */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Authorization</Text>
                        <Text className="text-sm text-gray-600">
                            Information for logging in to your account
                        </Text>
                    </View>

                    {/* Login Info */}
                    {securityData && (
                        <View className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                            <Text className="text-xs text-gray-500 mb-1">{securityData.login.title}</Text>
                            <Text className="text-lg font-semibold text-gray-900">{securityData.login.value}</Text>
                        </View>
                    )}

                    {/* Change Password Section */}
                    <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <View className="p-4 border-b border-gray-200">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900">Password</Text>
                                    <Text className="text-sm text-gray-500 mt-0.5">
                                        {showPasswordForm ? 'Enter your passwords below' : 'Change your account password'}
                                    </Text>
                                </View>
                                {!showPasswordForm && (
                                    <TouchableOpacity
                                        onPress={() => setShowPasswordForm(true)}
                                        className="bg-orange-500 px-4 py-2 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-white font-semibold">Change</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Password Form */}
                        {showPasswordForm && (
                            <View className="p-6">
                                {/* Current Password */}
                                <View className="mb-5">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Current Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry={!showCurrent}
                                            className="px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 bg-white"
                                            placeholder="Enter current password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowCurrent(!showCurrent)}
                                            style={{ position: 'absolute', right: 12, top: 12 }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#9ca3af"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View className="mb-5">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry={!showNew}
                                            className="px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 bg-white"
                                            placeholder="Enter new password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowNew(!showNew)}
                                            style={{ position: 'absolute', right: 12, top: 12 }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#9ca3af"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Character Count */}
                                    <View className="flex-row justify-end mt-1">
                                        <Text className="text-xs text-gray-500">{newPassword.length}</Text>
                                    </View>

                                    {/* Password Requirements */}
                                    {newPassword !== '' && (
                                        <View style={{ marginTop: 12, gap: 8 }}>
                                            <PasswordCheck check={passwordValidation.length} label="Between 8-15 characters" />
                                            <PasswordCheck check={passwordValidation.uppercase} label="At least one upper and one lower case letter" />
                                            <PasswordCheck check={passwordValidation.number} label="At least one number" />
                                            <PasswordCheck check={passwordValidation.special} label="At least one special character" />
                                        </View>
                                    )}
                                </View>

                                {/* Confirm Password */}
                                <View className="mb-6">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Repeat New Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirm}
                                            className="px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 bg-white"
                                            placeholder="Re-enter new password"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirm(!showConfirm)}
                                            style={{ position: 'absolute', right: 12, top: 12 }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#9ca3af"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <Text className="text-red-600 text-xs mt-1">Passwords do not match</Text>
                                    )}
                                </View>

                                {/* Buttons */}
                                <View style={{ gap: 12 }}>
                                    <TouchableOpacity
                                        onPress={handleChangePassword}
                                        disabled={loading || !isFormValid}
                                        className={`py-3.5 rounded-lg ${loading || !isFormValid ? 'bg-gray-300' : 'bg-orange-500'
                                            }`}
                                        activeOpacity={0.7}
                                    >
                                        {loading ? (
                                            <View className="flex-row items-center justify-center gap-2">
                                                <ActivityIndicator size="small" color="#ffffff" />
                                                <Text className="text-white font-semibold text-center">
                                                    Changing...
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text className="text-white font-semibold text-center text-base">
                                                Confirm
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowPasswordForm(false)
                                            setCurrentPassword('')
                                            setNewPassword('')
                                            setConfirmPassword('')
                                        }}
                                        disabled={loading}
                                        className="bg-gray-100 py-3.5 rounded-lg"
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-gray-700 font-semibold text-center text-base">Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const PasswordCheck = ({ check, label }) => (
    <View className="flex-row items-center gap-2">
        <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${check ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'}`}>
            {check && <Ionicons name="checkmark" size={10} color="white" />}
        </View>
        <Text className={`text-sm flex-1 ${check ? 'text-green-700' : 'text-gray-600'}`}>{label}</Text>
    </View>
)

export default Security
