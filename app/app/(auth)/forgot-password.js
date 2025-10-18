import { View, Text, TextInput, TouchableOpacity, Pressable, StatusBar } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Loading from '../../components/Loading'
import OTPInput from '../../components/OTPInput'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import { useTheme } from '@/context/themeContext'
import api from '@/services/api'

const ForgotPassword = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})
    const { theme } = useTheme()

    const emailRef = useRef("")
    const newPasswordRef = useRef("")

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertData({
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertVisible(false))
        })
        setAlertVisible(true)
    }

    const handleSendResetCode = async () => {
        const email = emailRef.current?.trim()

        if (!email) {
            showAlert("Password Reset", "Email address is required!", 'error')
            return
        }

        if (!validateEmail(email)) {
            showAlert("Password Reset", "Please enter a valid email address!", 'error')
            return
        }

        setLoading(true)
        try {
            const response = await api.post('/auth/forgot-password', { email })

            if (response.data && response.data.success) {
                setCurrentStep(2)
                const message = response.data.otp
                    ? `Reset code sent! (DEV MODE - Code: ${response.data.otp})`
                    : `Password reset code has been sent to ${email}!`
                showAlert("Success", message, 'success')
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset code"
            showAlert("Error", message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (otp) => {
        const email = emailRef.current?.trim()
        const newPassword = newPasswordRef.current?.trim()

        if (!newPassword || newPassword.length < 6) {
            showAlert("Password Reset", "New password must be at least 6 characters long!", 'error')
            return
        }

        setLoading(true)
        try {
            const response = await api.post('/auth/reset-password', { email, otp, newPassword })

            if (response.data && response.data.success) {
                showAlert("Success", "Password reset successful! Please sign in with your new password.", 'success',
                    () => {
                        setAlertVisible(false)
                        router.push('/signin')
                    }
                )
            }
        } catch (error) {
            const message = error.response?.data?.message || "Password reset failed"
            showAlert("Reset Error", message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar barStyle={theme.statusBarStyle} />
            <LinearGradient
                colors={[theme.bgPrimary, theme.bgSecondary]}
                className="flex-1"
            >
                <SafeAreaView className="flex-1">
                    {/* Header */}
                    <View className="px-6 pt-6 pb-4">
                        <View className="flex-row items-center justify-between mb-4">
                            <TouchableOpacity
                                onPress={() => currentStep === 1 ? router.back() : setCurrentStep(1)}
                                className="w-10 h-10 rounded-full items-center justify-center"
                                style={{ backgroundColor: `${theme.cardBg}33` }}
                            >
                                <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
                            </TouchableOpacity>
                            <Text
                                className="text-lg font-bold"
                                style={{ color: theme.textPrimary }}
                            >
                                Reset Password
                            </Text>
                            <View className="w-10" />
                        </View>

                        <View className="items-center">
                            <View
                                className="w-16 h-16 rounded-lg items-center justify-center mb-3"
                                style={{ backgroundColor: theme.primary }}
                            >
                                <Ionicons name="lock-closed" size={28} color="white" />
                            </View>
                            <Text
                                className="text-2xl font-bold"
                                style={{ color: theme.textPrimary }}
                            >
                                {currentStep === 1 ? "Forgot Password?" : "Reset Your Password"}
                            </Text>
                            <Text
                                className="text-center mt-2 px-4"
                                style={{ color: theme.textSecondary }}
                            >
                                {currentStep === 1
                                    ? "Enter your email to receive a reset code"
                                    : "Enter the code and your new password"
                                }
                            </Text>
                        </View>
                    </View>

                    {/* Form Content */}
                    <View className="px-6">
                        <View
                            className="rounded-3xl p-6 mb-6"
                            style={{ backgroundColor: theme.cardBg }}
                        >
                            {/* Step 1: Email Input */}
                            {currentStep === 1 && (
                                <>
                                    <View className="items-center mb-6">
                                        <View
                                            className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                            style={{ backgroundColor: `${theme.primary}20` }}
                                        >
                                            <Ionicons name="mail" size={40} color={theme.primary} />
                                        </View>
                                        <Text
                                            className="text-center text-base"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            We'll send you a verification code to reset your password
                                        </Text>
                                    </View>

                                    <View className="mb-6">
                                        <Text
                                            className="text-sm font-medium mb-1"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            Email Address
                                        </Text>
                                        <View
                                            className="flex-row items-center px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderWidth: 1,
                                                borderColor: theme.inputBorder
                                            }}
                                        >
                                            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                                            <TextInput
                                                onChangeText={value => emailRef.current = value}
                                                placeholder="Enter your registered email"
                                                placeholderTextColor={theme.textTertiary}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                className="flex-1 ml-3 py-0 text-base"
                                                style={{ color: theme.textPrimary }}
                                            />
                                        </View>
                                    </View>

                                    {loading ? (
                                        <View className='py-4 items-center'>
                                            <Loading size="48" />
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={handleSendResetCode} className='rounded-lg overflow-hidden'>
                                            <LinearGradient
                                                colors={[theme.primary, theme.primaryDark]}
                                                className="py-4 items-center"
                                            >
                                                <Text className="text-white text-base font-bold">
                                                    Send Reset Code
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}

                            {/* Step 2: OTP & New Password */}
                            {currentStep === 2 && (
                                <>
                                    <View className="items-center mb-6">
                                        <View
                                            className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                            style={{ backgroundColor: `${theme.primary}20` }}
                                        >
                                            <Ionicons name="key" size={40} color={theme.primary} />
                                        </View>
                                        <Text
                                            className="text-center text-base mb-2"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            Enter the 6-digit code sent to
                                        </Text>
                                        <Text
                                            className="font-bold text-base"
                                            style={{ color: theme.primary }}
                                        >
                                            {emailRef.current}
                                        </Text>
                                    </View>

                                    {/* New Password Input */}
                                    <View className="mb-6">
                                        <Text
                                            className="text-sm font-medium mb-1"
                                            style={{ color: theme.textPrimary }}
                                        >
                                            New Password
                                        </Text>
                                        <View
                                            className="flex-row items-center px-4 py-3 rounded-lg"
                                            style={{
                                                backgroundColor: theme.inputBg,
                                                borderWidth: 1,
                                                borderColor: theme.inputBorder
                                            }}
                                        >
                                            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                                            <TextInput
                                                onChangeText={value => newPasswordRef.current = value}
                                                placeholder="Enter your new password"
                                                placeholderTextColor={theme.textTertiary}
                                                secureTextEntry={!showNewPassword}
                                                className="flex-1 ml-3 py-0 text-base"
                                                style={{ color: theme.textPrimary }}
                                            />
                                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                                <Ionicons
                                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                                    size={20}
                                                    color={theme.textSecondary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            className="text-xs mt-1 ml-1"
                                            style={{ color: theme.textTertiary }}
                                        >
                                            Must be at least 6 characters
                                        </Text>
                                    </View>

                                    <OTPInput
                                        onComplete={handleResetPassword}
                                        loading={loading}
                                    />

                                    <TouchableOpacity onPress={() => setCurrentStep(1)} className="mt-4">
                                        <Text
                                            className="text-center text-sm font-semibold"
                                            style={{ color: theme.primary }}
                                        >
                                            Change Email Address
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Back to Sign In */}
                        <View className="flex-row justify-center pb-8">
                            <Text
                                className="text-base"
                                style={{ color: theme.textSecondary }}
                            >
                                Remember your password?
                            </Text>
                            <Pressable onPress={() => router.push('/signin')}>
                                <Text
                                    className="text-base font-bold ml-1"
                                    style={{ color: theme.primary }}
                                >
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <AlertModal
                visible={alertVisible}
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                onConfirm={alertData.onConfirm}
                onCancel={() => setAlertVisible(false)}
                confirmText="OK"
            />
        </CustomKeyboardView>
    )
}

export default ForgotPassword
