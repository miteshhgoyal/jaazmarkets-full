import { View, Text, TextInput, TouchableOpacity, Pressable, StatusBar } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Loading from '../../components/Loading'
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import { useAuth } from '@/context/authContext'
import { useTheme } from '@/context/themeContext'
import api from '@/services/api'

const Signin = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})
    const { login } = useAuth()
    const { theme } = useTheme()

    const userInputRef = useRef("")
    const passwordRef = useRef("")

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertData({
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertVisible(false))
        })
        setAlertVisible(true)
    }

    const validateForm = () => {
        const userInput = userInputRef.current?.trim()
        const password = passwordRef.current?.trim()

        if (!userInput) {
            showAlert("Validation Error", "Username or Email is required", 'error')
            return false
        }

        if (!password) {
            showAlert("Validation Error", "Password is required", 'error')
            return false
        }

        return true
    }

    const handleSignin = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await api.post('/auth/login', {
                userInput: userInputRef.current?.trim(),
                password: passwordRef.current?.trim()
            })

            if (response.data.token) {
                await login(response.data.token, response.data.user);
                showAlert("Welcome!", "Sign in successful!", 'success',
                    () => {
                        setAlertVisible(false)
                        router.replace('/tabs/accounts')
                    }
                )
            }
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credentials. Please try again."
            showAlert("Sign In Error", message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        showAlert("Coming Soon", "Google login will be available soon", 'info')
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
                    <View className="px-6 pt-8 pb-6">
                        <View className="items-center mb-8">
                            <View
                                className="w-16 h-16 rounded-lg items-center justify-center mb-4"
                                style={{ backgroundColor: theme.primary }}
                            >
                                <Ionicons name="trending-up" size={32} color="white" />
                            </View>
                            <Text
                                className="text-3xl text-center font-bold"
                                style={{ color: theme.textPrimary }}
                            >
                                Welcome to Jaazmarkets
                            </Text>
                            <Text
                                className="text-base mt-2"
                                style={{ color: theme.textSecondary }}
                            >
                                Sign in to your account
                            </Text>
                        </View>
                    </View>

                    {/* Form Container */}
                    <View className="px-6">
                        <View
                            className="rounded-3xl p-6 mb-6"
                            style={{ backgroundColor: theme.cardBg }}
                        >
                            {/* Username or Email Input */}
                            <View className="mb-5">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Email or Username
                                </Text>
                                <View
                                    className="flex-row items-center px-4 py-3 rounded-lg"
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderWidth: 1,
                                        borderColor: theme.inputBorder
                                    }}
                                >
                                    <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                                    <TextInput
                                        onChangeText={value => userInputRef.current = value}
                                        placeholder="Enter username or email"
                                        placeholderTextColor={theme.textTertiary}
                                        autoCapitalize="none"
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Password
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
                                        onChangeText={value => passwordRef.current = value}
                                        placeholder="Enter your password"
                                        placeholderTextColor={theme.textTertiary}
                                        secureTextEntry={!showPassword}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={theme.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <Pressable onPress={() => router.push('/forgot-password')} className="mb-6">
                                <Text
                                    className="text-right text-sm font-semibold"
                                    style={{ color: theme.primary }}
                                >
                                    I forgot my password
                                </Text>
                            </Pressable>

                            {/* Sign In Button */}
                            {loading ? (
                                <View className='py-4 items-center'>
                                    <Loading size="48" />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleSignin} className='rounded-lg overflow-hidden mb-4'>
                                    <LinearGradient
                                        colors={[theme.primary, theme.primaryDark]}
                                        className="py-4 items-center"
                                    >
                                        <Text className="text-white text-base font-bold">
                                            Continue
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}

                            {/* Divider */}
                            {/* <View className="flex-row items-center my-4">
                                <View
                                    className="flex-1 h-px"
                                    style={{ backgroundColor: theme.borderPrimary }}
                                />
                                <Text
                                    className="mx-4 text-sm"
                                    style={{ color: theme.textSecondary }}
                                >
                                    or sign in with
                                </Text>
                                <View
                                    className="flex-1 h-px"
                                    style={{ backgroundColor: theme.borderPrimary }}
                                />
                            </View> */}

                            {/* Google Sign In */}
                            {/* <TouchableOpacity
                                onPress={handleGoogleLogin}
                                disabled={loading}
                                className="flex-row items-center justify-center py-3 rounded-lg"
                                style={{ backgroundColor: theme.inputBg }}
                            >
                                <Ionicons name="logo-google" size={20} color={theme.textPrimary} />
                                <Text
                                    className="ml-2 text-base font-semibold"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Google
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center pb-8">
                            <Text
                                className="text-base"
                                style={{ color: theme.textSecondary }}
                            >
                                Don't have an account?
                            </Text>
                            <Pressable onPress={() => router.push('/signup')}>
                                <Text
                                    className="text-base font-bold ml-1"
                                    style={{ color: theme.primary }}
                                >
                                    Sign up
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View className="h-8" />
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

export default Signin
