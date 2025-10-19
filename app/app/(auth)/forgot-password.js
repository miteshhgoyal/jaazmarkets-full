import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar, Animated, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
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
    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [confirmFocused, setConfirmFocused] = useState(false)

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const otpRefs = useRef([])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start()
    }, [step])

    // Countdown timer
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleEmailSubmit = async () => {
        if (!email.trim()) {
            setError('Email is required')
            return
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/forgot-password', { email })
            setStep(2)
            setCountdown(60)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyPress = (index, key) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

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
            setOtp(['', '', '', '', '', ''])
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long')
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

    const handleResendOtp = async () => {
        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/forgot-password', { email })
            setCountdown(60)
            setOtp(['', '', '', '', '', ''])
            showAlert('Success', 'New code sent to your email', 'success')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code')
        } finally {
            setIsLoading(false)
        }
    }

    const getStepIcon = () => {
        switch (step) {
            case 1: return 'mail'
            case 2: return 'shield-checkmark'
            case 3: return 'lock-closed'
            default: return 'mail'
        }
    }

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Reset Password'
            case 2: return 'Verify Your Email'
            case 3: return 'Set New Password'
            default: return 'Reset Password'
        }
    }

    const getStepSubtitle = () => {
        switch (step) {
            case 1: return 'Enter your email to receive a reset code'
            case 2: return 'Complete your verification'
            case 3: return 'Create a strong password'
            default: return ''
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar barStyle="light-content" backgroundColor="#f97316" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 bg-gray-50"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Gradient */}
                    <LinearGradient
                        colors={['#f97316', '#fb923c', '#fdba74']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="pt-16 pb-12 px-6"
                    >
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }}
                        >
                            {step > 1 && (
                                <Pressable
                                    onPress={() => setStep(step - 1)}
                                    className="flex-row items-center mb-4"
                                >
                                    <Ionicons name="arrow-back" size={20} color="white" />
                                    <Text className="text-white ml-2 font-medium">Back</Text>
                                </Pressable>
                            )}

                            <View className="items-center mb-6">
                                <View className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl items-center justify-center mb-4 shadow-lg">
                                    <Ionicons name={getStepIcon()} size={40} color="white" />
                                </View>
                                <Text className="text-3xl font-bold text-white mb-2">
                                    {getStepTitle()}
                                </Text>
                                <Text className="text-white/90 text-center text-base">
                                    {getStepSubtitle()}
                                </Text>
                            </View>
                        </Animated.View>
                    </LinearGradient>

                    {/* Form Container */}
                    <View className="flex-1 px-6 -mt-6">
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }}
                            className="bg-white rounded-3xl shadow-2xl p-6"
                        >
                            {error && (
                                <View className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <View className="flex-row items-center">
                                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                                        <Text className="text-red-700 text-sm ml-2 flex-1">{error}</Text>
                                    </View>
                                </View>
                            )}

                            {/* STEP 1: Email Input */}
                            {step === 1 && (
                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </Text>
                                    <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 mb-5 ${emailFocused
                                            ? 'border-orange-500 bg-orange-50'
                                            : error
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-200 bg-gray-50'
                                        }`}>
                                        <Ionicons
                                            name="mail"
                                            size={22}
                                            color={emailFocused ? '#f97316' : error ? '#ef4444' : '#9ca3af'}
                                        />
                                        <TextInput
                                            value={email}
                                            onChangeText={(value) => { setEmail(value); setError('') }}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            placeholder="your.email@example.com"
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            className="flex-1 ml-3 text-gray-900 text-base"
                                        />
                                        {email && !error && (
                                            <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleEmailSubmit}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={isLoading ? ['#9ca3af', '#6b7280'] : ['#f97316', '#ea580c']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="py-4 rounded-xl shadow-lg"
                                        >
                                            {isLoading ? (
                                                <View className="flex-row items-center justify-center">
                                                    <Loading size={24} color="white" />
                                                    <Text className="text-white font-bold text-base ml-2">
                                                        Sending Code...
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center justify-center">
                                                    <Text className="text-white font-bold text-base mr-2">
                                                        Send Reset Code
                                                    </Text>
                                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* STEP 2: OTP Verification */}
                            {step === 2 && (
                                <View>
                                    <Text className="text-sm text-gray-600 text-center mb-6">
                                        Enter the 6-digit code sent to{'\n'}
                                        <Text className="font-semibold text-gray-900">{email}</Text>
                                    </Text>

                                    <View className="mb-8">
                                        <View className="flex-row justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <TextInput
                                                    key={index}
                                                    ref={ref => otpRefs.current[index] = ref}
                                                    value={digit}
                                                    onChangeText={(value) => handleOtpChange(index, value)}
                                                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                                                    maxLength={1}
                                                    keyboardType="number-pad"
                                                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl ${digit ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'
                                                        }`}
                                                />
                                            ))}
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleOtpSubmit}
                                        disabled={isLoading || otp.join('').length !== 6}
                                        activeOpacity={0.8}
                                        className="mb-6"
                                    >
                                        <LinearGradient
                                            colors={(isLoading || otp.join('').length !== 6) ? ['#9ca3af', '#6b7280'] : ['#22c55e', '#16a34a']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="py-4 rounded-xl shadow-lg"
                                        >
                                            {isLoading ? (
                                                <View className="flex-row items-center justify-center">
                                                    <Loading size={24} color="white" />
                                                    <Text className="text-white font-bold text-base ml-2">
                                                        Verifying...
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center justify-center">
                                                    <Ionicons name="checkmark-circle" size={22} color="white" />
                                                    <Text className="text-white font-bold text-base ml-2">
                                                        Verify Code
                                                    </Text>
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <View className="items-center">
                                        <Text className="text-sm text-gray-600">
                                            Didn't receive the code?{' '}
                                        </Text>
                                        {countdown > 0 ? (
                                            <Text className="text-orange-600 font-semibold mt-1">
                                                Resend in {formatTime(countdown)}
                                            </Text>
                                        ) : (
                                            <TouchableOpacity onPress={handleResendOtp} disabled={isLoading} className="mt-1">
                                                <Text className="text-orange-600 font-bold">Resend Code</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* STEP 3: New Password */}
                            {step === 3 && (
                                <View>
                                    <View className="mb-5">
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                                            New Password
                                        </Text>
                                        <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${passwordFocused
                                                ? 'border-orange-500 bg-orange-50'
                                                : error && !confirmPassword
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}>
                                            <Ionicons
                                                name="lock-closed"
                                                size={22}
                                                color={passwordFocused ? '#f97316' : '#9ca3af'}
                                            />
                                            <TextInput
                                                value={newPassword}
                                                onChangeText={(value) => { setNewPassword(value); setError('') }}
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                                placeholder="Create a strong password"
                                                placeholderTextColor="#9ca3af"
                                                secureTextEntry={!showPassword}
                                                className="flex-1 ml-3 text-gray-900 text-base"
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={showPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#9ca3af"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View className="mb-6">
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                                            Confirm Password
                                        </Text>
                                        <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${confirmFocused
                                                ? 'border-orange-500 bg-orange-50'
                                                : error
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}>
                                            <Ionicons
                                                name="lock-closed"
                                                size={22}
                                                color={confirmFocused ? '#f97316' : '#9ca3af'}
                                            />
                                            <TextInput
                                                value={confirmPassword}
                                                onChangeText={(value) => { setConfirmPassword(value); setError('') }}
                                                onFocus={() => setConfirmFocused(true)}
                                                onBlur={() => setConfirmFocused(false)}
                                                placeholder="Confirm your password"
                                                placeholderTextColor="#9ca3af"
                                                secureTextEntry={!showConfirmPassword}
                                                className="flex-1 ml-3 text-gray-900 text-base"
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#9ca3af"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handlePasswordSubmit}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={isLoading ? ['#9ca3af', '#6b7280'] : ['#3b82f6', '#2563eb']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="py-4 rounded-xl shadow-lg"
                                        >
                                            {isLoading ? (
                                                <View className="flex-row items-center justify-center">
                                                    <Loading size={24} color="white" />
                                                    <Text className="text-white font-bold text-base ml-2">
                                                        Resetting Password...
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center justify-center">
                                                    <Ionicons name="checkmark-done" size={22} color="white" />
                                                    <Text className="text-white font-bold text-base ml-2">
                                                        Reset Password
                                                    </Text>
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Animated.View>

                        {/* Back to Sign In */}
                        <View className="mt-8 mb-6 flex-row justify-center items-center">
                            <Text className="text-gray-600 text-base">
                                Remember your password?{' '}
                            </Text>
                            <Pressable onPress={() => router.push('/signin')} className="py-1">
                                <Text className="text-orange-600 font-bold text-base">
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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
