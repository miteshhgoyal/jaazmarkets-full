import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import { useAuth } from '@/context/authContext'
import api from '@/services/api'

const signup = () => {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useLocalSearchParams()
    const otpRefs = useRef([])

    const [step, setStep] = useState(1) // 1 = form, 2 = OTP
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        referralCode: ''
    })
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendTimer, setResendTimer] = useState(0)

    // Auto-fill referral code from URL
    useEffect(() => {
        if (searchParams.ref) {
            setFormData(prev => ({ ...prev, referralCode: searchParams.ref }))
        }
    }, [searchParams])

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    // Auto-focus first OTP input when step changes to 2
    useEffect(() => {
        if (step === 2) {
            setTimeout(() => {
                otpRefs.current[0]?.focus()
            }, 300)
        }
    }, [step])

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async () => {
        setError('')

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('Please enter your full name')
            return
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email')
            return
        }
        if (!formData.mobile.trim() || formData.mobile.length < 10) {
            setError('Please enter a valid mobile number')
            return
        }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        try {
            const response = await api.post('/auth/signup', formData)

            if (response.data.success) {
                setStep(2)
                setResendTimer(60)
                setOtp(['', '', '', '', '', ''])
            } else {
                setError(response.data.message || 'Registration failed')
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        // Handle paste or multi-character input
        if (value.length > 1) {
            const digits = value.slice(0, 6).split('')
            const newOtp = [...otp]

            digits.forEach((digit, i) => {
                if (index + i < 6 && /^\d$/.test(digit)) {
                    newOtp[index + i] = digit
                }
            })

            setOtp(newOtp)

            // Focus last filled input or next empty
            const lastIndex = Math.min(index + digits.length, 5)
            setTimeout(() => {
                otpRefs.current[lastIndex]?.focus()
            }, 10)

            setError('')
            return
        }

        // Only allow single digits
        if (value && !/^\d$/.test(value)) return

        // Update OTP array
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            setTimeout(() => {
                otpRefs.current[index + 1]?.focus()
            }, 10)
        }

        setError('')
    }

    const handleOtpKeyPress = (index, key) => {
        if (key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                const newOtp = [...otp]
                newOtp[index - 1] = ''
                setOtp(newOtp)
                setTimeout(() => {
                    otpRefs.current[index - 1]?.focus()
                }, 10)
            } else {
                // Clear current input
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            }
        }
    }

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('')

        if (otpValue.length !== 6) {
            setError('Please enter complete 6-digit code')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/verify-email-otp', {
                email: formData.email,
                otp: otpValue,
                password: formData.password
            })

            if (response.data.success && response.data.data) {
                const { accessToken, refreshToken, user } = response.data.data
                await login({ accessToken, refreshToken, user })
                router.replace('/(tabs)/accounts')
            } else {
                setError(response.data.message || 'Verification failed')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (resendTimer > 0) return

        setIsLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/resend-verification-otp', {
                email: formData.email
            })

            if (response.data.success) {
                setResendTimer(60)
                setOtp(['', '', '', '', '', ''])
                setTimeout(() => {
                    otpRefs.current[0]?.focus()
                }, 100)
            } else {
                setError(response.data.message || 'Failed to resend code')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const isOtpComplete = otp.join('').length === 6

    return (
        <CustomKeyboardView>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center px-6 py-8">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4">
                            <Ionicons name={step === 1 ? "person-add" : "mail"} size={32} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">
                            {step === 1 ? 'Create Account' : 'Verify Email'}
                        </Text>
                        <Text className="text-gray-500 mt-1 text-center">
                            {step === 1 ? 'Sign up to get started' : `Code sent to ${formData.email}`}
                        </Text>
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <Text className="text-red-600 text-sm text-center">{error}</Text>
                        </View>
                    ) : null}

                    {step === 1 ? (
                        <>
                            {/* Registration Form */}
                            <View className="flex-row gap-3 mb-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
                                    <TextInput
                                        value={formData.firstName}
                                        onChangeText={(value) => handleInputChange('firstName', value)}
                                        placeholder="John"
                                        autoCapitalize="words"
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
                                    <TextInput
                                        value={formData.lastName}
                                        onChangeText={(value) => handleInputChange('lastName', value)}
                                        placeholder="Doe"
                                        autoCapitalize="words"
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
                                <TextInput
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="your.email@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Mobile</Text>
                                <TextInput
                                    value={formData.mobile}
                                    onChangeText={(value) => handleInputChange('mobile', value)}
                                    placeholder="+1234567890"
                                    keyboardType="phone-pad"
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
                                    <TextInput
                                        value={formData.password}
                                        onChangeText={(value) => handleInputChange('password', value)}
                                        placeholder="Create a password"
                                        secureTextEntry={!passwordVisible}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        className="flex-1 text-gray-900"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Referral Code (Optional)</Text>
                                <TextInput
                                    value={formData.referralCode}
                                    onChangeText={(value) => handleInputChange('referralCode', value)}
                                    placeholder="Enter referral code"
                                    autoCapitalize="characters"
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                className={`py-3 rounded-lg mb-4 ${isLoading ? 'bg-gray-400' : 'bg-orange-500'}`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center justify-center">
                                        <Loading size={20} color="white" />
                                        <Text className="text-white font-semibold ml-2">Creating Account...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold text-center">Create Account</Text>
                                )}
                            </TouchableOpacity>

                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/signin')} activeOpacity={0.7}>
                                    <Text className="text-orange-500 font-semibold">Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* OTP Verification */}
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
                                            selectTextOnFocus
                                            textContentType="oneTimeCode"
                                            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg ${digit ? 'border-orange-500 text-gray-900' : 'border-gray-300 text-gray-900'
                                                }`}
                                        />
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleVerifyOtp}
                                disabled={isLoading || !isOtpComplete}
                                activeOpacity={0.8}
                                className={`py-3 rounded-lg mb-4 ${(isLoading || !isOtpComplete) ? 'bg-gray-400' : 'bg-orange-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center justify-center">
                                        <Loading size={20} color="white" />
                                        <Text className="text-white font-semibold ml-2">Verifying...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold text-center">Verify & Continue</Text>
                                )}
                            </TouchableOpacity>

                            <View className="items-center mb-4">
                                <Text className="text-sm text-gray-600 mb-2">Didn't receive code?</Text>
                                {resendTimer > 0 ? (
                                    <Text className="text-orange-500 font-semibold">Resend in {resendTimer}s</Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7} disabled={isLoading}>
                                        <Text className="text-orange-500 font-semibold">Resend Code</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setStep(1)
                                    setOtp(['', '', '', '', '', ''])
                                    setError('')
                                }}
                                activeOpacity={0.7}
                                className="items-center pt-4 border-t border-gray-200"
                            >
                                <Text className="text-gray-600">
                                    Wrong email? <Text className="text-orange-500 font-semibold">Start Over</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </CustomKeyboardView>
    )
}

export default signup
