import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar, Animated, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import { useAuth } from '@/context/authContext'
import api from '@/services/api'

const signin = () => {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useLocalSearchParams()
    const from = searchParams.from || '/(tabs)/accounts'
    const successMessage = searchParams.message

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})
    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current

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
    }, [])

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

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }
        if (!formData.password?.trim()) {
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
        try {
            const response = await api.post('/auth/signin', {
                email: formData.email,
                password: formData.password
            })

            if (response.data.data) {
                const { accessToken, refreshToken, user } = response.data.data

                await login({
                    accessToken,
                    refreshToken,
                    user
                })

                router.replace(from)
            }
        } catch (error) {
            console.error('Login error:', error)
            const message = error.response?.data?.message || 'Invalid credentials. Please try again.'
            setErrors({ submit: message })
            showAlert('Login Failed', message, 'error')
        } finally {
            setIsLoading(false)
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
                            {/* Logo/Icon */}
                            <View className="items-center mb-6">
                                <View className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl items-center justify-center mb-4 shadow-lg">
                                    <Ionicons name="trending-up" size={40} color="white" />
                                </View>
                                <Text className="text-3xl font-bold text-white mb-2">
                                    Welcome Back
                                </Text>
                                <Text className="text-white/90 text-center text-base">
                                    Sign in to continue trading
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
                            {/* Success Message */}
                            {successMessage && (
                                <View className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                    <View className="flex-row items-center">
                                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                        <Text className="text-green-700 text-sm ml-2 flex-1">{successMessage}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Error Message */}
                            {errors.submit && (
                                <View className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <View className="flex-row items-center">
                                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                                        <Text className="text-red-700 text-sm ml-2 flex-1">{errors.submit}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Email Input */}
                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </Text>
                                <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${emailFocused
                                        ? 'border-orange-500 bg-orange-50'
                                        : errors.email
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-gray-50'
                                    }`}>
                                    <Ionicons
                                        name="mail"
                                        size={22}
                                        color={emailFocused ? '#f97316' : errors.email ? '#ef4444' : '#9ca3af'}
                                    />
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={(value) => handleInputChange('email', value)}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        placeholder="your.email@example.com"
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="flex-1 ml-3 text-gray-900 text-base"
                                    />
                                    {formData.email && !errors.email && (
                                        <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                                    )}
                                </View>
                                {errors.email && (
                                    <View className="flex-row items-center mt-2">
                                        <Ionicons name="alert-circle" size={14} color="#ef4444" />
                                        <Text className="ml-1 text-xs text-red-600">{errors.email}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="mb-5">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </Text>
                                <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${passwordFocused
                                        ? 'border-orange-500 bg-orange-50'
                                        : errors.password
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-gray-50'
                                    }`}>
                                    <Ionicons
                                        name="lock-closed"
                                        size={22}
                                        color={passwordFocused ? '#f97316' : errors.password ? '#ef4444' : '#9ca3af'}
                                    />
                                    <TextInput
                                        value={formData.password}
                                        onChangeText={(value) => handleInputChange('password', value)}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!passwordVisible}
                                        className="flex-1 ml-3 text-gray-900 text-base"
                                    />
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
                                </View>
                                {errors.password && (
                                    <View className="flex-row items-center mt-2">
                                        <Ionicons name="alert-circle" size={14} color="#ef4444" />
                                        <Text className="ml-1 text-xs text-red-600">{errors.password}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Forgot Password */}
                            <View className="items-end mb-6">
                                <Pressable
                                    onPress={() => router.push('/reset-password')}
                                    className="py-1"
                                >
                                    <Text className="text-sm text-orange-600 font-semibold">
                                        Forgot Password?
                                    </Text>
                                </Pressable>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                className="mb-5"
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
                                                Signing In...
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center justify-center">
                                            <Text className="text-white font-bold text-base mr-2">
                                                Sign In
                                            </Text>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center my-6">
                                <View className="flex-1 h-px bg-gray-200" />
                                <Text className="px-4 text-gray-500 text-sm">OR</Text>
                                <View className="flex-1 h-px bg-gray-200" />
                            </View>

                            {/* Sign Up Link */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 text-base">
                                    Don't have an account?{' '}
                                </Text>
                                <Pressable
                                    onPress={() => router.push('/signup')}
                                    className="py-1"
                                >
                                    <Text className="text-orange-600 font-bold text-base">
                                        Sign Up
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>

                        {/* Footer */}
                        <View className="mt-8 mb-6 items-center">
                            <Text className="text-gray-500 text-xs text-center">
                                By signing in, you agree to our
                            </Text>
                            <View className="flex-row">
                                <Pressable>
                                    <Text className="text-orange-600 text-xs font-semibold">Terms</Text>
                                </Pressable>
                                <Text className="text-gray-500 text-xs"> and </Text>
                                <Pressable>
                                    <Text className="text-orange-600 text-xs font-semibold">Privacy Policy</Text>
                                </Pressable>
                            </View>
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

export default signin
