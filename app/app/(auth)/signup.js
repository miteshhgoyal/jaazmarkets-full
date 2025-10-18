import { View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Loading from "../../components/Loading"
import CustomKeyboardView from "../../components/CustomKeyboardView"
import AlertModal from '../../components/AlertModal'
import { useAuth } from '@/context/authContext'
import { useTheme } from '@/context/themeContext'
import api from '@/services/api'

const signup = () => {
    const router = useRouter()
    const { login } = useAuth()
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const [countries, setCountries] = useState([])
    const [showPassword, setShowPassword] = useState({})
    const [agreeTax, setAgreeTax] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertData, setAlertData] = useState({})

    // Form refs
    const nameRef = useRef("")
    const emailRef = useRef("")
    const countryRef = useRef("")
    const partnerCodeRef = useRef("")
    const passwordRef = useRef("")
    const confirmPasswordRef = useRef("")

    // Fetch country list
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name")
            .then((res) => res.json())
            .then((data) =>
                setCountries(
                    data.map((c) => c.name.common).sort((a, b) => a.localeCompare(b))
                )
            )
            .catch(() => setCountries([]))
    }, [])

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}$/

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertData({
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertVisible(false))
        })
        setAlertVisible(true)
    }

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

    const validateForm = () => {
        const name = nameRef.current?.trim()
        const email = emailRef.current?.trim()
        const country = countryRef.current?.trim()
        const password = passwordRef.current?.trim()
        const confirmPassword = confirmPasswordRef.current?.trim()

        if (!name || name.length < 3) {
            showAlert("Validation Error", "Full name must be at least 3 characters", 'error')
            return false
        }

        if (!email || !isValidEmail(email)) {
            showAlert("Validation Error", "Please enter a valid email address", 'error')
            return false
        }

        if (!country) {
            showAlert("Validation Error", "Please select your country of residence", 'error')
            return false
        }

        if (!password || !pwRegex.test(password)) {
            showAlert("Validation Error", "Password must be 8-15 characters with uppercase, lowercase, number, and special character", 'error')
            return false
        }

        if (password !== confirmPassword) {
            showAlert("Validation Error", "Passwords don't match", 'error')
            return false
        }

        if (!agreeTax) {
            showAlert("Validation Error", "You must confirm the tax declaration", 'error')
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await api.post("/auth/register", {
                name: nameRef.current?.trim(),
                email: emailRef.current?.trim(),
                country: countryRef.current?.trim(),
                partnerCode: partnerCodeRef.current?.trim(),
                password: passwordRef.current?.trim(),
                agreeTax
            })

            if (response.data.token) {
                await login(response.data.token, response.data.user)
                showAlert("Welcome! 🎉", "Account created successfully!", 'success',
                    () => {
                        setAlertVisible(false)
                        router.replace('/verify-otp')
                    }
                )
            }
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed"
            showAlert("Registration Error", message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = () => {
        showAlert("Coming Soon", "Google sign-in will be available soon", 'info')
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
                        <View className="items-center w-full">
                            <View
                                className="w-16 h-16 rounded-lg items-center justify-center mb-4"
                                style={{ backgroundColor: theme.primary }}
                            >
                                <Ionicons name="trending-up" size={32} color="white" />
                            </View>
                            <Text
                                className="text-3xl font-bold"
                                style={{ color: theme.textPrimary }}
                            >
                                Create Account
                            </Text>
                            <Text
                                className="text-base mt-2"
                                style={{ color: theme.textSecondary }}
                            >
                                Join Jaazmarkets today
                            </Text>
                        </View>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                        <View
                            className="rounded-3xl p-6 mb-6"
                            style={{ backgroundColor: theme.cardBg }}
                        >
                            {/* Full Name */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Full Name *
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
                                        onChangeText={value => nameRef.current = value}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={theme.textTertiary}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Email *
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
                                        placeholder="Enter your email"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* Country */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Country of Residence *
                                </Text>
                                <View
                                    className="flex-row items-center px-4 py-3 rounded-lg"
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderWidth: 1,
                                        borderColor: theme.inputBorder
                                    }}
                                >
                                    <Ionicons name="globe-outline" size={20} color={theme.textSecondary} />
                                    <TextInput
                                        onChangeText={value => countryRef.current = value}
                                        placeholder="Select country"
                                        placeholderTextColor={theme.textTertiary}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                    <Ionicons name="chevron-down-outline" size={20} color={theme.textSecondary} />
                                </View>
                                <Text
                                    className="text-xs mt-1 ml-1"
                                    style={{ color: theme.textTertiary }}
                                >
                                    Type or select from list
                                </Text>
                            </View>

                            {/* Partner Code */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Partner Code (optional)
                                </Text>
                                <View
                                    className="flex-row items-center px-4 py-3 rounded-lg"
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderWidth: 1,
                                        borderColor: theme.inputBorder
                                    }}
                                >
                                    <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
                                    <TextInput
                                        onChangeText={value => partnerCodeRef.current = value}
                                        placeholder="Enter code"
                                        placeholderTextColor={theme.textTertiary}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                </View>
                            </View>

                            {/* Password */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Password *
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
                                        placeholder="Create a password"
                                        placeholderTextColor={theme.textTertiary}
                                        secureTextEntry={!showPassword.password}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                    <TouchableOpacity onPress={() => togglePasswordVisibility('password')}>
                                        <Ionicons
                                            name={showPassword.password ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={theme.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View className="mt-2 ml-1">
                                    <Text className="text-xs" style={{ color: theme.textTertiary }}>• 8-15 characters</Text>
                                    <Text className="text-xs" style={{ color: theme.textTertiary }}>• Upper & lower case</Text>
                                    <Text className="text-xs" style={{ color: theme.textTertiary }}>• At least one number</Text>
                                    <Text className="text-xs" style={{ color: theme.textTertiary }}>• At least one special character</Text>
                                </View>
                            </View>

                            {/* Confirm Password */}
                            <View className="mb-4">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: theme.textPrimary }}
                                >
                                    Confirm Password *
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
                                        onChangeText={value => confirmPasswordRef.current = value}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={theme.textTertiary}
                                        secureTextEntry={!showPassword.confirmPassword}
                                        className="flex-1 ml-3 py-0 text-base"
                                        style={{ color: theme.textPrimary }}
                                    />
                                    <TouchableOpacity onPress={() => togglePasswordVisibility('confirmPassword')}>
                                        <Ionicons
                                            name={showPassword.confirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={theme.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Tax Declaration Checkbox */}
                            <View className="mb-6">
                                <TouchableOpacity
                                    onPress={() => setAgreeTax(!agreeTax)}
                                    className="flex-row items-start"
                                >
                                    <View
                                        className="w-5 h-5 rounded border-2 items-center justify-center mr-3 mt-0.5"
                                        style={{
                                            backgroundColor: agreeTax ? theme.primary : 'transparent',
                                            borderColor: agreeTax ? theme.primary : theme.borderSecondary
                                        }}
                                    >
                                        {agreeTax && <Ionicons name="checkmark" size={16} color="white" />}
                                    </View>
                                    <Text
                                        className="flex-1 text-sm"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        I declare that I am not a citizen or resident of the United States for tax purposes.
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Continue Button */}
                            {loading ? (
                                <View className='py-4 items-center'>
                                    <Loading size="48" />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleSubmit} className='rounded-lg overflow-hidden mb-4'>
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
                                    or sign up with
                                </Text>
                                <View
                                    className="flex-1 h-px"
                                    style={{ backgroundColor: theme.borderPrimary }}
                                />
                            </View> */}

                            {/* Google Sign In */}
                            {/* <TouchableOpacity
                                onPress={handleGoogle}
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

                        {/* Sign In Link */}
                        <View className="flex-row justify-center pb-8">
                            <Text
                                className="text-base"
                                style={{ color: theme.textSecondary }}
                            >
                                Already have an account?
                            </Text>
                            <Pressable onPress={() => router.push('/signin')}>
                                <Text
                                    className="text-base font-bold ml-1"
                                    style={{ color: theme.primary }}
                                >
                                    Sign in
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            <AlertModal
                visible={alertVisible}
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                onConfirm={alertData.onConfirm}
                confirmText="OK"
            />
        </CustomKeyboardView>
    )
}

export default signup
