import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
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
        }
        if (!formData.password?.trim()) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Use /auth/signin endpoint with email and password
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
            showAlert('Login Error', message, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CustomKeyboardView>
            <StatusBar barStyle="dark-content" backgroundColor="#fff5f0" />
            <ScrollView
                className="flex-1 bg-gradient-to-br from-orange-50 to-white"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <SafeAreaView className="flex-1 px-4 py-8">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4">
                            <Ionicons name="trending-up" size={32} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">
                            Welcome to JaazMarkets
                        </Text>
                    </View>

                    {/* Success Message */}
                    {successMessage && (
                        <View className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <Text className="text-green-700 text-sm">{successMessage}</Text>
                        </View>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <Text className="text-red-700 text-sm">{errors.submit}</Text>
                        </View>
                    )}

                    {/* Form Container */}
                    <View className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
                        {/* Email Input */}
                        <View className="mb-4">
                            <Text className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </Text>
                            <View className="relative">
                                <View className="absolute left-3 top-3 z-10">
                                    <Ionicons name="person" size={20} color="#9ca3af" />
                                </View>
                                <TextInput
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900"
                                    style={{ fontSize: 16 }}
                                />
                            </View>
                            {errors.email && (
                                <Text className="mt-1 text-sm text-red-600">{errors.email}</Text>
                            )}
                        </View>

                        {/* Password Input */}
                        <View className="mb-4">
                            <Text className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </Text>
                            <View className="relative">
                                <View className="absolute left-3 top-3 z-10">
                                    <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                                </View>
                                <TextInput
                                    value={formData.password}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!passwordVisible}
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md text-gray-900"
                                    style={{ fontSize: 16 }}
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-3 top-3"
                                >
                                    <Ionicons
                                        name={passwordVisible ? "eye-off" : "eye"}
                                        size={20}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text className="mt-1 text-sm text-red-600">{errors.password}</Text>
                            )}
                        </View>

                        {/* Forgot Password */}
                        <View className="items-end mb-4">
                            <Pressable onPress={() => router.push('/reset-password')}>
                                <Text className="text-sm text-blue-500 font-medium">
                                    I forgot my password
                                </Text>
                            </Pressable>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-orange-500 py-3 px-4 rounded-md items-center mb-4"
                            style={{ opacity: isLoading ? 0.5 : 1 }}
                        >
                            {isLoading ? (
                                <Loading size={24} />
                            ) : (
                                <Text className="text-white font-medium">Continue</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View className="mt-6 flex-row justify-center">
                        <Text className="text-sm text-gray-600">
                            Don't have an account?{' '}
                        </Text>
                        <Pressable onPress={() => router.push('/signup')}>
                            <Text className="text-sm text-orange-600 font-medium">
                                Sign up
                            </Text>
                        </Pressable>
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

export default signin
