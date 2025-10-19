import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import api from '@/services/api'

const ForgotPassword = () => {
    const router = useRouter()

    const [step, setStep] = useState(1) // 1 = email, 2 = otp, 3 = new password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})

    // Countdown timer for resend OTP
    useEffect(() => {
        let timer
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertData({
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertVisible(false))
        })
        setAlertVisible(true)
    }

    // Format countdown time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Handle email submission
    const handleEmailSubmit = async () => {
        if (!email.trim()) {
            setError('Email is required')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/forgot-password', { email })
            setStep(2)
            setCountdown(40) // Start 40 second countdown
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')
    }

    // Handle OTP submission
    const handleOtpSubmit = async () => {
        const otpCode = otp.join('')

        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/verify-reset-otp', { email, otp: otpCode })
            setStep(3)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code')
            setOtp(['', '', '', '', '', '']) // Clear OTP
        } finally {
            setIsLoading(false)
        }
    }

    // Handle new password submission
    const handlePasswordSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/reset-password', {
                email,
                otp: otp.join(''),
                newPassword
            })

            // Success - redirect to login
            showAlert('Success', 'Password reset successfully!', 'success', () => {
                setAlertVisible(false)
                router.replace({
                    pathname: '/signin',
                    params: { message: 'Password reset successfully. Please login with your new password.' }
                })
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/forgot-password', { email })
            setCountdown(40)
            setOtp(['', '', '', '', '', ''])
            showAlert('Success', 'New code sent to your email', 'success')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code')
        } finally {
            setIsLoading(false)
        }
    }

    // STEP 1: Email Input
    if (step === 1) {
        return (
            <CustomKeyboardView>
                <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" />
                <ScrollView
                    className="flex-1 bg-gradient-to-br from-blue-50 to-white"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <SafeAreaView className="flex-1 px-4 py-8">
                        <View className="items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                Reset Password
                            </Text>
                            <Text className="text-gray-600">
                                Enter your email to receive a reset code
                            </Text>
                        </View>

                        <View className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
                            {error && (
                                <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <Text className="text-red-700 text-sm">{error}</Text>
                                </View>
                            )}

                            <View className="mb-4">
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-3 top-3 z-10">
                                        <Ionicons name="mail" size={20} color="#9ca3af" />
                                    </View>
                                    <TextInput
                                        value={email}
                                        onChangeText={(value) => { setEmail(value); setError('') }}
                                        placeholder="Enter your email address"
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900"
                                        style={{ fontSize: 16 }}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleEmailSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 py-3 px-4 rounded-md items-center"
                                style={{ opacity: isLoading ? 0.5 : 1 }}
                            >
                                {isLoading ? (
                                    <Loading size={24} />
                                ) : (
                                    <Text className="text-white font-medium">Continue</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="mt-6 items-center">
                            <Pressable onPress={() => router.push('/signin')}>
                                <Text className="text-blue-600 font-medium text-sm">
                                    Sign in now
                                </Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </CustomKeyboardView>
        )
    }

    // STEP 2: OTP Verification
    if (step === 2) {
        return (
            <CustomKeyboardView>
                <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" />
                <ScrollView
                    className="flex-1 bg-gradient-to-br from-blue-50 to-white"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <SafeAreaView className="flex-1 px-4 py-8">
                        <Pressable onPress={() => setStep(1)} className="flex-row items-center mb-4">
                            <Ionicons name="arrow-back" size={16} color="#3b82f6" />
                            <Text className="text-blue-600 ml-1">Back</Text>
                        </Pressable>

                        <View className="items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                Verify your account
                            </Text>
                            <Text className="text-gray-600 mb-1">
                                Confirm the operation
                            </Text>
                            <Text className="text-gray-500 text-sm text-center">
                                Enter the confirmation code sent to your current 2-Step verification method
                            </Text>
                        </View>

                        <View className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
                            {error && (
                                <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <Text className="text-red-700 text-sm">{error}</Text>
                                </View>
                            )}

                            {/* OTP Input */}
                            <View className="flex-row justify-center gap-3 mb-6">
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(index, value)}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md"
                                        style={{ fontSize: 18 }}
                                        editable={!isLoading}
                                    />
                                ))}
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity
                                onPress={handleOtpSubmit}
                                disabled={isLoading || otp.join('').length !== 6}
                                className="w-full bg-blue-600 py-3 px-4 rounded-md items-center mb-6"
                                style={{ opacity: (isLoading || otp.join('').length !== 6) ? 0.5 : 1 }}
                            >
                                {isLoading ? (
                                    <Loading size={24} />
                                ) : (
                                    <Text className="text-white font-medium">Verify</Text>
                                )}
                            </TouchableOpacity>

                            {/* Resend Code */}
                            <View className="items-center">
                                {countdown > 0 ? (
                                    <Text className="text-sm text-gray-600">
                                        Get a new code in <Text className="font-medium">{formatTime(countdown)}</Text>
                                    </Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                                        <Text className="text-sm text-blue-600 font-medium">
                                            Resend code
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View className="mt-6 items-center">
                            <Pressable onPress={() => router.push('/signin')}>
                                <Text className="text-blue-600 font-medium text-sm">
                                    Sign in now
                                </Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </CustomKeyboardView>
        )
    }

    // STEP 3: New Password
    if (step === 3) {
        return (
            <CustomKeyboardView>
                <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" />
                <ScrollView
                    className="flex-1 bg-gradient-to-br from-blue-50 to-white"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <SafeAreaView className="flex-1 px-4 py-8">
                        <Pressable onPress={() => setStep(2)} className="flex-row items-center mb-4">
                            <Ionicons name="arrow-back" size={16} color="#3b82f6" />
                            <Text className="text-blue-600 ml-1">Back</Text>
                        </Pressable>

                        <View className="items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                Set New Password
                            </Text>
                            <Text className="text-gray-600">
                                Create a strong password for your account
                            </Text>
                        </View>

                        <View className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
                            {error && (
                                <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <Text className="text-red-700 text-sm">{error}</Text>
                                </View>
                            )}

                            {/* New Password */}
                            <View className="mb-4">
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-3 top-3 z-10">
                                        <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                                    </View>
                                    <TextInput
                                        value={newPassword}
                                        onChangeText={(value) => { setNewPassword(value); setError('') }}
                                        placeholder="Enter new password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md text-gray-900"
                                        style={{ fontSize: 16 }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3"
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off" : "eye"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password */}
                            <View className="mb-4">
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-3 top-3 z-10">
                                        <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                                    </View>
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={(value) => { setConfirmPassword(value); setError('') }}
                                        placeholder="Confirm new password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showConfirmPassword}
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md text-gray-900"
                                        style={{ fontSize: 16 }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3"
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off" : "eye"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handlePasswordSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 py-3 px-4 rounded-md items-center"
                                style={{ opacity: isLoading ? 0.5 : 1 }}
                            >
                                {isLoading ? (
                                    <Loading size={24} />
                                ) : (
                                    <Text className="text-white font-medium">Reset Password</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </ScrollView>

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
}

export default ForgotPassword
