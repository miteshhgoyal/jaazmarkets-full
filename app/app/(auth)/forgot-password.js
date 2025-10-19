import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import api from '@/services/api'

const ForgotPassword = () => {
    const router = useRouter()
    const otpRefs = useRef([])

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

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleEmailSubmit = async () => {
        setError('')

        if (!email.trim()) {
            setError('Email is required')
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email')
            return
        }

        setIsLoading(true)
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
            setError('Please enter complete 6-digit code')
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
        setError('')

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        try {
            await api.post('/auth/reset-password', {
                email,
                otp: otp.join(''),
                newPassword
            })

            router.replace({
                pathname: '/signin',
                params: { message: 'Password reset successfully. Please login.' }
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (countdown > 0) return

        setIsLoading(true)
        setError('')

        try {
            await api.post('/auth/forgot-password', { email })
            setCountdown(60)
            setOtp(['', '', '', '', '', ''])
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code')
        } finally {
            setIsLoading(false)
        }
    }

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Reset Password'
            case 2: return 'Verify Email'
            case 3: return 'New Password'
            default: return 'Reset Password'
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

    return (
        <CustomKeyboardView>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6 py-8">
                    {/* Header */}
                    <View className="items-center mb-8">
                        {step > 1 && (
                            <TouchableOpacity
                                onPress={() => setStep(step - 1)}
                                className="self-start mb-4"
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="arrow-back" size={20} color="#f97316" />
                                    <Text className="text-orange-500 ml-2 font-medium">Back</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4">
                            <Ionicons name={getStepIcon()} size={32} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">{getStepTitle()}</Text>
                        <Text className="text-gray-500 mt-1 text-center">
                            {step === 1 && 'Enter your email to receive a reset code'}
                            {step === 2 && `Code sent to ${email}`}
                            {step === 3 && 'Create a strong password'}
                        </Text>
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <Text className="text-red-600 text-sm">{error}</Text>
                        </View>
                    ) : null}

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <>
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={(value) => { setEmail(value); setError('') }}
                                    placeholder="your.email@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleEmailSubmit}
                                disabled={isLoading}
                                className={`py-3 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-orange-500'}`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center justify-center">
                                        <Loading size={20} color="white" />
                                        <Text className="text-white font-semibold ml-2">Sending...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold text-center">Send Reset Code</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <>
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
                                    Enter 6-Digit Code
                                </Text>
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
                                            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg ${digit ? 'border-orange-500' : 'border-gray-300'
                                                }`}
                                        />
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleOtpSubmit}
                                disabled={isLoading || otp.join('').length !== 6}
                                className={`py-3 rounded-lg mb-4 ${(isLoading || otp.join('').length !== 6) ? 'bg-gray-400' : 'bg-green-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center justify-center">
                                        <Loading size={20} color="white" />
                                        <Text className="text-white font-semibold ml-2">Verifying...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold text-center">Verify Code</Text>
                                )}
                            </TouchableOpacity>

                            <View className="items-center">
                                <Text className="text-sm text-gray-600 mb-2">Didn't receive code?</Text>
                                {countdown > 0 ? (
                                    <Text className="text-orange-500 font-semibold">Resend in {countdown}s</Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResendOtp}>
                                        <Text className="text-orange-500 font-semibold">Resend Code</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <>
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">New Password</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                                    <TextInput
                                        value={newPassword}
                                        onChangeText={(value) => { setNewPassword(value); setError('') }}
                                        placeholder="Create a password"
                                        secureTextEntry={!showPassword}
                                        className="flex-1 text-gray-900"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={(value) => { setConfirmPassword(value); setError('') }}
                                        placeholder="Confirm your password"
                                        secureTextEntry={!showConfirmPassword}
                                        className="flex-1 text-gray-900"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handlePasswordSubmit}
                                disabled={isLoading}
                                className={`py-3 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center justify-center">
                                        <Loading size={20} color="white" />
                                        <Text className="text-white font-semibold ml-2">Resetting...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold text-center">Reset Password</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Back to Sign In */}
                    <View className="flex-row justify-center items-center mt-6">
                        <Text className="text-gray-600">Remember your password? </Text>
                        <TouchableOpacity onPress={() => router.push('/signin')}>
                            <Text className="text-orange-500 font-semibold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </CustomKeyboardView>
    )
}

export default ForgotPassword
