import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar, BackHandler, Animated, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import { useAuth } from '@/context/authContext'
import api from '@/services/api'

const signup = () => {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useLocalSearchParams()

    // States
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
    const [errors, setErrors] = useState({})
    const [resendTimer, setResendTimer] = useState(0)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})
    const [focusedField, setFocusedField] = useState('')

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

    // Auto-fill referral code from URL
    useEffect(() => {
        const refCode = searchParams.ref
        if (refCode) {
            setFormData(prev => ({ ...prev, referralCode: refCode }))
        }
    }, [searchParams])

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    // Prevent back navigation on OTP step
    useEffect(() => {
        if (step === 2) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                setErrors({ otp: 'Please complete OTP verification or start over' })
                return true
            })
            return () => backHandler.remove()
        }
    }, [step])

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertData({
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertVisible(false))
        })
        setAlertVisible(true)
    }

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Enter a valid email'
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required'
        } else if (formData.mobile.length < 10) {
            newErrors.mobile = 'Enter a valid mobile number'
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        setErrors({})

        try {
            const response = await api.post('/auth/signup', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                referralCode: formData.referralCode
            })

            if (response.data.success) {
                setStep(2)
                setResendTimer(60)
                setOtp(['', '', '', '', '', ''])
            } else {
                if (response.data.userExists && response.data.isVerified) {
                    setErrors({
                        submit: response.data.message,
                        redirectToLogin: true
                    })
                } else {
                    setErrors({ submit: response.data.message || 'Registration failed' })
                }
            }
        } catch (err) {
            console.error('Registration error:', err)
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
            const shouldRedirect = err.response?.data?.userExists && err.response?.data?.isVerified

            setErrors({
                submit: errorMessage,
                redirectToLogin: shouldRedirect
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }

        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }))
        }
    }

    const handleOtpKeyPress = (index, key) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('')

        if (otpValue.length !== 6) {
            setErrors({ otp: 'Please enter complete 6-digit code' })
            return
        }

        setIsLoading(true)
        setErrors({})

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
                setErrors({ otp: response.data.message || 'Verification failed' })
            }
        } catch (err) {
            console.error('OTP verification error:', err)
            const errorMsg = err.response?.data?.message || 'Invalid or expired code. Please try again.'
            const isExpired = err.response?.data?.expired

            setErrors({
                otp: errorMsg,
                expired: isExpired
            })

            if (isExpired) {
                setTimeout(() => handleResendOtp(), 2000)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (resendTimer > 0) return

        setIsLoading(true)
        setErrors({})

        try {
            const response = await api.post('/auth/resend-verification-otp', {
                email: formData.email
            })

            if (response.data.success) {
                setResendTimer(60)
                setOtp(['', '', '', '', '', ''])
                showAlert('Success', 'New verification code sent!', 'success')
            } else {
                setErrors({ otp: response.data.message || 'Failed to resend code' })
            }
        } catch (err) {
            console.error('Resend OTP error:', err)
            setErrors({ otp: err.response?.data?.message || 'Failed to resend code' })
        } finally {
            setIsLoading(false)
        }
    }

    const renderFormField = ({ name, label, type, placeholder, icon, required }) => {
        const isPw = name === 'password'
        const isFocused = focusedField === name
        const hasError = errors[name]
        const hasValue = formData[name]

        return (
            <View key={name} className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <Text className="text-red-500">*</Text>}
                </Text>
                <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${isFocused
                        ? 'border-orange-500 bg-orange-50'
                        : hasError
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                    <Ionicons
                        name={icon}
                        size={22}
                        color={isFocused ? '#f97316' : hasError ? '#ef4444' : '#9ca3af'}
                    />
                    <TextInput
                        value={formData[name]}
                        onChangeText={(value) => handleInputChange(name, value)}
                        onFocus={() => setFocusedField(name)}
                        onBlur={() => setFocusedField('')}
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={isPw && !passwordVisible}
                        keyboardType={type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'}
                        autoCapitalize={type === 'email' ? 'none' : 'words'}
                        className="flex-1 ml-3 text-gray-900 text-base"
                    />
                    {isPw && (
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={passwordVisible ? "eye-off" : "eye"}
                                size={22}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    )}
                    {hasValue && !hasError && !isPw && (
                        <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                    )}
                </View>
                {hasError && (
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="alert-circle" size={14} color="#ef4444" />
                        <Text className="ml-1 text-xs text-red-600">{errors[name]}</Text>
                    </View>
                )}
            </View>
        )
    }

    const renderRegistrationForm = () => (
        <View>
            <View className="flex-row gap-3">
                <View className="flex-1">
                    {renderFormField({
                        name: 'firstName',
                        label: 'First Name',
                        type: 'text',
                        placeholder: 'John',
                        icon: 'person',
                        required: true
                    })}
                </View>
                <View className="flex-1">
                    {renderFormField({
                        name: 'lastName',
                        label: 'Last Name',
                        type: 'text',
                        placeholder: 'Doe',
                        icon: 'person',
                        required: true
                    })}
                </View>
            </View>

            {renderFormField({
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'your.email@example.com',
                icon: 'mail',
                required: true
            })}
            {renderFormField({
                name: 'mobile',
                label: 'Mobile Number',
                type: 'tel',
                placeholder: '+1234567890',
                icon: 'call',
                required: true
            })}
            {renderFormField({
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: 'Create a strong password',
                icon: 'lock-closed',
                required: true
            })}
            {renderFormField({
                name: 'referralCode',
                label: 'Referral Code',
                type: 'text',
                placeholder: 'Optional',
                icon: 'people',
                required: false
            })}

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
                className="mb-4"
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
                                Creating Account...
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center justify-center">
                            <Text className="text-white font-bold text-base mr-2">
                                Create Account
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            <Text className="text-xs text-gray-500 text-center">
                By signing up, you agree to our Terms & Privacy Policy
            </Text>
        </View>
    )

    const renderOtpForm = () => (
        <View>
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="mail" size={40} color="#ea580c" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Verify Your Email
                </Text>
                <Text className="text-sm text-gray-600 text-center px-4">
                    We've sent a 6-digit verification code to{'\n'}
                    <Text className="font-semibold text-gray-900">{formData.email}</Text>
                </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Enter Verification Code
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
                            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl ${digit ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'
                                }`}
                        />
                    ))}
                </View>
                {errors.otp && (
                    <View className="flex-row items-center justify-center mt-3">
                        <Ionicons name="alert-circle" size={16} color="#ef4444" />
                        <Text className="ml-2 text-sm text-red-600 text-center">{errors.otp}</Text>
                    </View>
                )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
                onPress={handleVerifyOtp}
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
                                Verify & Continue
                            </Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            {/* Resend Code */}
            <View className="items-center mb-4">
                <Text className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                </Text>
                {resendTimer > 0 ? (
                    <Text className="text-orange-600 font-semibold mt-1">
                        Resend in {resendTimer}s
                    </Text>
                ) : (
                    <TouchableOpacity onPress={handleResendOtp} disabled={isLoading} className="mt-1">
                        <Text className="text-orange-600 font-bold">Resend Code</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Start Over */}
            <View className="items-center pt-4 border-t border-gray-200">
                <TouchableOpacity
                    onPress={() => {
                        setStep(1)
                        setOtp(['', '', '', '', '', ''])
                        setErrors({})
                    }}
                    className="py-2"
                >
                    <Text className="text-sm text-gray-600">
                        Wrong email? <Text className="text-orange-600 font-semibold">Start over</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

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
                            <View className="items-center mb-6">
                                <View className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl items-center justify-center mb-4 shadow-lg">
                                    <Ionicons name={step === 1 ? "person-add" : "mail"} size={40} color="white" />
                                </View>
                                <Text className="text-3xl font-bold text-white mb-2">
                                    {step === 1 ? 'Create Account' : 'Email Verification'}
                                </Text>
                                <Text className="text-white/90 text-center text-base">
                                    {step === 1 ? 'Join JaazMarkets today' : 'Complete your registration'}
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
                            {errors.submit && (
                                <View className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <View className="flex-row items-start">
                                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                                        <View className="flex-1 ml-2">
                                            <Text className="text-red-700 text-sm">{errors.submit}</Text>
                                            {errors.redirectToLogin && (
                                                <Pressable onPress={() => router.push('/signin')} className="mt-2">
                                                    <Text className="text-orange-600 font-semibold text-sm">Go to Login</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )}

                            {step === 1 ? renderRegistrationForm() : renderOtpForm()}
                        </Animated.View>

                        {/* Sign In Link */}
                        {step === 1 && (
                            <View className="mt-8 mb-6 flex-row justify-center items-center">
                                <Text className="text-gray-600 text-base">
                                    Already have an account?{' '}
                                </Text>
                                <Pressable onPress={() => router.push('/signin')} className="py-1">
                                    <Text className="text-orange-600 font-bold text-base">
                                        Sign In
                                    </Text>
                                </Pressable>
                            </View>
                        )}
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

export default signup
