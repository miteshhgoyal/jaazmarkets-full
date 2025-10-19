import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
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

    // PREVENT BACK NAVIGATION WHEN ON OTP STEP
    useEffect(() => {
        if (step === 2) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                // Show warning or just prevent going back
                setErrors({ otp: 'Please complete OTP verification or start over' })
                return true // Prevent default back
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

    // FORM HANDLERS
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
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // STEP 1: SUBMIT REGISTRATION FORM
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
                setStep(2) // Move to OTP verification step
                setResendTimer(60) // Start 60 second timer
                setOtp(['', '', '', '', '', '']) // Clear OTP
            } else {
                // Check if user exists and is verified
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

    // OTP INPUT HANDLERS
    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Clear errors when user types
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }))
        }
    }

    // STEP 2: VERIFY OTP
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
                password: formData.password // Pass for registration email
            })

            if (response.data.success && response.data.data) {
                const { accessToken, refreshToken, user } = response.data.data

                // Save auth data
                await login({ accessToken, refreshToken, user })

                // Redirect to dashboard
                router.replace('/tabs/accounts')
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

            // Auto-trigger resend if expired
            if (isExpired) {
                setTimeout(() => handleResendOtp(), 2000)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // RESEND OTP
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

    // RENDER FUNCTIONS
    const renderFormField = ({ name, label, type, placeholder, icon, required }) => {
        const isPw = name === 'password'
        const showPw = isPw && passwordVisible

        return (
            <View key={name} className="mb-4">
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </Text>
                <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                        <Ionicons name={icon} size={20} color="#9ca3af" />
                    </View>
                    <TextInput
                        value={formData[name]}
                        onChangeText={(value) => handleInputChange(name, value)}
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={isPw && !showPw}
                        keyboardType={type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'}
                        autoCapitalize={type === 'email' ? 'none' : 'words'}
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-gray-900"
                        style={{ fontSize: 16 }}
                    />
                    {isPw && (
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-3 top-3"
                        >
                            <Ionicons
                                name={showPw ? "eye-off" : "eye"}
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {errors[name] && (
                    <Text className="mt-1 text-sm text-red-600">{errors[name]}</Text>
                )}
            </View>
        )
    }

    const renderRegistrationForm = () => (
        <View>
            {renderFormField({
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                placeholder: 'Enter your first name',
                icon: 'person',
                required: true
            })}
            {renderFormField({
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                placeholder: 'Enter your last name',
                icon: 'person',
                required: true
            })}
            {renderFormField({
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Enter your email',
                icon: 'mail',
                required: true
            })}
            {renderFormField({
                name: 'mobile',
                label: 'Mobile Number',
                type: 'tel',
                placeholder: 'Enter your mobile number',
                icon: 'call',
                required: true
            })}
            {renderFormField({
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: 'Create a password',
                icon: 'lock-closed',
                required: true
            })}
            {renderFormField({
                name: 'referralCode',
                label: 'Referral Code (Optional)',
                type: 'text',
                placeholder: 'Enter referral code if you have one',
                icon: 'people',
                required: false
            })}

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 py-3 px-4 rounded-lg items-center shadow-md"
                style={{ opacity: isLoading ? 0.5 : 1, backgroundColor: '#fb923c' }}
            >
                {isLoading ? (
                    <Loading size={24} />
                ) : (
                    <Text className="text-white font-medium">Continue</Text>
                )}
            </TouchableOpacity>
        </View>
    )

    const renderOtpForm = () => (
        <View>
            <View className="items-center mb-6">
                <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-3">
                    <Ionicons name="mail" size={32} color="#ea580c" />
                </View>
                <Text className="text-xl font-semibold text-gray-900 mb-2">
                    Verify Your Email
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                    We've sent a 6-digit code to{'\n'}
                    <Text className="font-medium text-gray-900">{formData.email}</Text>
                </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-6">
                <Text className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Enter Verification Code
                </Text>
                <View className="flex-row gap-2 justify-center">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(index, value)}
                            maxLength={1}
                            keyboardType="number-pad"
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg"
                            style={{ fontSize: 20 }}
                        />
                    ))}
                </View>
                {errors.otp && (
                    <Text className="mt-2 text-sm text-red-600 text-center">{errors.otp}</Text>
                )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 py-3 px-4 rounded-lg items-center shadow-md mb-4"
                style={{ opacity: (isLoading || otp.join('').length !== 6) ? 0.5 : 1, backgroundColor: '#fb923c' }}
            >
                {isLoading ? (
                    <Loading size={24} />
                ) : (
                    <Text className="text-white font-medium">Verify & Continue</Text>
                )}
            </TouchableOpacity>

            {/* Resend Code */}
            <View className="items-center">
                <Text className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    {resendTimer > 0 ? (
                        <Text className="text-gray-900 font-medium">
                            Resend in {resendTimer}s
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                            <Text className="text-orange-600 font-medium">Resend Code</Text>
                        </TouchableOpacity>
                    )}
                </Text>
            </View>

            {/* Start Over */}
            <View className="items-center pt-4 mt-4 border-t border-gray-200">
                <Text className="text-xs text-gray-500">
                    Need to change email?{' '}
                    <TouchableOpacity
                        onPress={() => {
                            setStep(1)
                            setOtp(['', '', '', '', '', ''])
                            setErrors({})
                        }}
                    >
                        <Text className="text-orange-600 font-medium">Start over</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    )

    return (
        <CustomKeyboardView>
            <StatusBar barStyle="dark-content" backgroundColor="#fff5f0" />
            <ScrollView
                className="flex-1 bg-gradient-to-br from-orange-50 via-white to-blue-50"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <SafeAreaView className="flex-1 px-4 py-8">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 1 ? 'Create Account' : 'Email Verification'}
                        </Text>
                        <Text className="text-gray-600">
                            {step === 1 ? 'Join Jaaz Markets today' : 'Complete your registration'}
                        </Text>
                    </View>

                    {/* Form Container */}
                    <View className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
                        {errors.submit && (
                            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <Text className="text-red-700 text-sm">{errors.submit}</Text>
                                {errors.redirectToLogin && (
                                    <Pressable onPress={() => router.push('/signin')} className="mt-2">
                                        <Text className="text-orange-600 font-medium text-sm">Go to Login</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}

                        {step === 1 ? renderRegistrationForm() : renderOtpForm()}
                    </View>

                    {/* Sign In Link */}
                    {step === 1 && (
                        <View className="mt-6 flex-row justify-center">
                            <Text className="text-sm text-gray-600">
                                Already have an account?{' '}
                            </Text>
                            <Pressable onPress={() => router.push('/signin')}>
                                <Text className="text-sm text-orange-600 font-medium">
                                    Sign in
                                </Text>
                            </Pressable>
                        </View>
                    )}
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

export default signup
