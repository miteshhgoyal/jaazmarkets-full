import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import api from '@/services/api'

const NewAccount = () => {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [accountType, setAccountType] = useState('Demo')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [createdAccount, setCreatedAccount] = useState(null)

    // Picker visibility states
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
    const [showLeveragePicker, setShowLeveragePicker] = useState(false)
    const [showPlatformPicker, setShowPlatformPicker] = useState(false)

    // Settings from backend
    const [settings, setSettings] = useState(null)
    const [loadingSettings, setLoadingSettings] = useState(true)

    const [formData, setFormData] = useState({
        currency: 'USD',
        startingBalance: '10000',
        nickname: '',
        leverage: '1:100',
        platform: 'MT5',
        traderPassword: '',
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoadingSettings(true)
            const response = await api.get('/account/settings')

            if (response.data.success) {
                setSettings(response.data.data)

                // Set defaults
                if (response.data.data.platforms.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        platform: response.data.data.platforms[0].name,
                    }))
                }
                if (response.data.data.currencies.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        currency: response.data.data.currencies[0].code,
                    }))
                }
                if (response.data.data.leverageOptions.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        leverage: response.data.data.leverageOptions[0],
                    }))
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            Alert.alert('Error', 'Failed to load account options')
        } finally {
            setLoadingSettings(false)
        }
    }

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleAccountSelect = (account) => {
        setSelectedAccount(account)
    }

    const handleContinue = () => {
        if (selectedAccount) {
            setStep(2)
            setFormData({ ...formData, nickname: selectedAccount.name })
        }
    }

    const handleBack = () => {
        setStep(1)
        setSelectedAccount(null)
    }

    const handleClose = () => {
        try {
            if (router.canGoBack()) {
                router.back()
            } else {
                router.replace('/(tabs)/accounts')
            }
        } catch (error) {
            console.error('Navigation error:', error)
            router.replace('/(tabs)/accounts')
        }
    }

    const validatePassword = (password) => {
        return {
            length: password.length >= 8 && password.length <= 15,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        }
    }

    const handleSubmit = async () => {
        if (!formData.nickname.trim()) {
            Alert.alert('Validation Error', 'Please enter a nickname')
            return
        }

        if (formData.traderPassword) {
            const checks = validatePassword(formData.traderPassword)
            const allValid = Object.values(checks).every(v => v)
            if (!allValid) {
                Alert.alert('Invalid Password', 'Please meet all password requirements')
                return
            }
        }

        setLoading(true)

        try {
            const payload = {
                accountType: accountType,
                platform: formData.platform,
                accountClass: selectedAccount.name,
                currency: formData.currency,
                leverage: formData.leverage,
                startingBalance: accountType === 'Demo' ? Number(formData.startingBalance) : undefined,
                nickname: formData.nickname,
                traderPassword: formData.traderPassword || undefined,
            }

            const response = await api.post('/account/create', payload)

            if (response.data.success) {
                setCreatedAccount(response.data.data)
                setStep(3)
                Alert.alert('Success', 'Account created successfully!')
            }
        } catch (error) {
            console.error('Account creation error:', error)
            Alert.alert('Error', error.response?.data?.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = async (text, label) => {
        await Clipboard.setStringAsync(text)
        Alert.alert('Copied', `${label} copied to clipboard`)
    }

    const passwordChecks = validatePassword(formData.traderPassword)

    if (loadingSettings) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading account options...</Text>
            </View>
        )
    }

    if (!settings) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">Failed to load settings</Text>
                <Text className="text-gray-600 text-center mb-6">Please check your connection and try again</Text>
                <TouchableOpacity onPress={fetchSettings} className="bg-orange-500 px-6 py-3 rounded-lg">
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // STEP 1: Account Selection
    if (step === 1) {
        const standardAccounts = settings.accountTypes.filter(acc => acc.category === 'Standard accounts')
        const professionalAccounts = settings.accountTypes.filter(acc => acc.category === 'Professional accounts')

        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-900">Open Account</Text>
                            <Text className="text-gray-600 text-sm mt-1">Choose your account type</Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} className="p-2">
                            <Ionicons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
                    {standardAccounts.length > 0 && (
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-gray-900 mb-4">Standard Accounts</Text>
                            {standardAccounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    isSelected={selectedAccount?.id === account.id}
                                    onSelect={handleAccountSelect}
                                />
                            ))}
                        </View>
                    )}

                    {professionalAccounts.length > 0 && (
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-gray-900 mb-4">Professional Accounts</Text>
                            {professionalAccounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    isSelected={selectedAccount?.id === account.id}
                                    onSelect={handleAccountSelect}
                                />
                            ))}
                        </View>
                    )}

                    <View className="h-24" />
                </ScrollView>

                <View className="bg-white border-t border-gray-200 px-6 py-4">
                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!selectedAccount}
                        className={`py-4 rounded-lg ${selectedAccount ? 'bg-orange-500' : 'bg-gray-200'}`}
                        activeOpacity={0.7}
                    >
                        <Text className={`text-center font-semibold text-lg ${selectedAccount ? 'text-white' : 'text-gray-400'}`}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    // STEP 2: Account Setup Form
    if (step === 2) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-900">Set up account</Text>
                            <Text className="text-gray-600 text-sm">{selectedAccount?.name}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
                    {/* Demo/Real Toggle - ✅ REMOVED shadow-sm */}
                    <View className="bg-white rounded-lg p-2 mb-6" style={styles.cardShadow}>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setAccountType('Demo')}
                                className={`flex-1 py-3 rounded-lg ${accountType === 'Demo' ? 'bg-orange-500' : 'bg-white'}`}
                            >
                                <Text className={`text-center font-semibold ${accountType === 'Demo' ? 'text-white' : 'text-gray-600'}`}>
                                    Demo
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setAccountType('Real')}
                                className={`flex-1 py-3 rounded-lg ${accountType === 'Real' ? 'bg-orange-500' : 'bg-white'}`}
                            >
                                <Text className={`text-center font-semibold ${accountType === 'Real' ? 'text-white' : 'text-gray-600'}`}>
                                    Real
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text className="text-sm text-gray-600 mb-6">
                        {accountType === 'Demo'
                            ? 'Risk-free account. Trade with virtual money'
                            : 'Trade with real money and withdraw any profit you may make'}
                    </Text>

                    {/* Form - ✅ REMOVED shadow-sm */}
                    <View className="bg-white rounded-xl p-6" style={styles.cardShadow}>
                        {/* Currency Picker */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Currency <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCurrencyPicker(true)}
                                className="px-4 py-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
                            >
                                <Text className="text-gray-900">{formData.currency}</Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Starting Balance */}
                        {accountType === 'Demo' && (
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Starting balance <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={formData.startingBalance}
                                    onChangeText={(value) => handleInputChange('startingBalance', value)}
                                    keyboardType="numeric"
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                                    placeholder="Enter starting balance"
                                />
                                <Text className="text-xs text-gray-500 mt-1">
                                    Min: 100 | Max: 100,000
                                </Text>
                            </View>
                        )}

                        {/* Nickname */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Nickname <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.nickname}
                                onChangeText={(value) => handleInputChange('nickname', value)}
                                maxLength={36}
                                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                                placeholder="Enter account nickname"
                            />
                            <Text className="text-xs text-gray-500 mt-1">
                                {formData.nickname.length}/36 characters
                            </Text>
                        </View>

                        {/* Leverage Picker */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Max leverage <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowLeveragePicker(true)}
                                className="px-4 py-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
                            >
                                <Text className="text-gray-900">{formData.leverage}</Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Platform Picker */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Platform <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowPlatformPicker(true)}
                                className="px-4 py-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
                            >
                                <Text className="text-gray-900">{formData.platform}</Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`py-4 rounded-lg ${loading ? 'bg-gray-300' : 'bg-orange-500'} mt-4`}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <View className="flex-row items-center justify-center gap-2">
                                    <ActivityIndicator size="small" color="#ffffff" />
                                    <Text className="text-white font-semibold text-center text-lg">
                                        Creating account...
                                    </Text>
                                </View>
                            ) : (
                                <Text className="text-white font-semibold text-center text-lg">
                                    Create account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="h-24" />
                </ScrollView>

                {/* Modals */}
                <PickerModal
                    visible={showCurrencyPicker}
                    onClose={() => setShowCurrencyPicker(false)}
                    title="Select Currency"
                    options={settings.currencies.map(c => ({
                        label: `${c.code} - ${c.name} (${c.symbol})`,
                        value: c.code
                    }))}
                    selectedValue={formData.currency}
                    onSelect={(value) => {
                        handleInputChange('currency', value)
                        setShowCurrencyPicker(false)
                    }}
                />

                <PickerModal
                    visible={showLeveragePicker}
                    onClose={() => setShowLeveragePicker(false)}
                    title="Select Leverage"
                    options={settings.leverageOptions.map(l => ({
                        label: l,
                        value: l
                    }))}
                    selectedValue={formData.leverage}
                    onSelect={(value) => {
                        handleInputChange('leverage', value)
                        setShowLeveragePicker(false)
                    }}
                />

                <PickerModal
                    visible={showPlatformPicker}
                    onClose={() => setShowPlatformPicker(false)}
                    title="Select Platform"
                    options={settings.platforms.map(p => ({
                        label: p.name,
                        value: p.name
                    }))}
                    selectedValue={formData.platform}
                    onSelect={(value) => {
                        handleInputChange('platform', value)
                        setShowPlatformPicker(false)
                    }}
                />
            </SafeAreaView>
        )
    }

    // STEP 3: Success Screen
    if (step === 3 && createdAccount) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark-circle" size={40} color="#10b981" />
                        </View>
                        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                            Account Created!
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Your trading account has been created successfully
                        </Text>
                    </View>

                    <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <Text className="text-sm text-orange-800 font-semibold mb-1">
                            ⚠️ Important: Save your credentials
                        </Text>
                        <Text className="text-sm text-orange-700">
                            Your password will only be shown once. Please save it securely.
                        </Text>
                    </View>

                    {/* Credentials - ✅ REMOVED space-y-3, added gap style */}
                    <View style={{ marginBottom: 32 }}>
                        <CredentialRow label="Account Number" value={createdAccount.accountNumber} onCopy={copyToClipboard} />
                        <CredentialRow label="Login" value={createdAccount.login} onCopy={copyToClipboard} />
                        <CredentialRow label="Password" value={createdAccount.password} onCopy={copyToClipboard} highlight />
                        <CredentialRow label="Server" value={createdAccount.server} onCopy={copyToClipboard} />
                        <CredentialRow label="Platform" value={createdAccount.platform} />
                        <CredentialRow label="Account Type" value={createdAccount.accountType} />
                        <CredentialRow label="Balance" value={`${createdAccount.currency} ${createdAccount.balance}`} />
                    </View>

                    {/* Action Buttons - ✅ REMOVED space-y-3 */}
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)/accounts')}
                            className="bg-orange-500 py-4 rounded-lg"
                        >
                            <Text className="text-white font-semibold text-center text-lg">
                                View My Accounts
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setStep(1)
                                setSelectedAccount(null)
                                setCreatedAccount(null)
                                setFormData({
                                    currency: settings.currencies[0]?.code || 'USD',
                                    startingBalance: '10000',
                                    nickname: '',
                                    leverage: settings.leverageOptions[0] || '1:100',
                                    platform: settings.platforms[0]?.name || 'MT5',
                                    traderPassword: '',
                                })
                            }}
                            className="bg-white border-2 border-gray-300 py-4 rounded-lg"
                        >
                            <Text className="text-gray-900 font-semibold text-center text-lg">
                                Create Another
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return null
}

// ✅ ADD STYLESHEET for shadows
const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    }
})

// Helper Components
const AccountCard = ({ account, isSelected, onSelect }) => (
    <TouchableOpacity
        onPress={() => onSelect(account)}
        className={`bg-white rounded-xl p-4 mb-4 border-2 ${isSelected ? 'border-orange-400' : 'border-gray-200'}`}
        style={isSelected ? styles.cardShadow : null}
        activeOpacity={0.7}
    >
        <View className="flex-row items-start gap-4">
            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mt-1 ${isSelected ? 'border-orange-400 bg-orange-500' : 'border-gray-300 bg-white'}`}>
                {isSelected && <View className="w-2 h-2 bg-white rounded-full" />}
            </View>
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">{account.name}</Text>
                <Text className="text-sm text-gray-600 mb-3">{account.description}</Text>
                <View className="flex-row flex-wrap gap-4">
                    <View>
                        <Text className="text-xs text-gray-500">Min deposit</Text>
                        <Text className="text-sm font-semibold text-gray-900">{account.minDeposit}</Text>
                    </View>
                    <View>
                        <Text className="text-xs text-gray-500">Min spread</Text>
                        <Text className="text-sm font-semibold text-gray-900">{account.minSpread}</Text>
                    </View>
                    <View>
                        <Text className="text-xs text-gray-500">Max leverage</Text>
                        <Text className="text-sm font-semibold text-gray-900">{account.maxLeverage}</Text>
                    </View>
                    <View>
                        <Text className="text-xs text-gray-500">Commission</Text>
                        <Text className="text-sm font-semibold text-gray-900">{account.commission}</Text>
                    </View>
                </View>
            </View>
        </View>
    </TouchableOpacity>
)

const PasswordCheck = ({ check, label }) => (
    <View className="flex-row items-center gap-2" style={{ marginBottom: 8 }}>
        <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${check ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
            {check && <Ionicons name="checkmark" size={12} color="white" />}
        </View>
        <Text className={`text-sm ${check ? 'text-green-700' : 'text-gray-600'}`}>{label}</Text>
    </View>
)

const CredentialRow = ({ label, value, onCopy, highlight }) => (
    <View className={`flex-row items-center justify-between p-4 rounded-lg ${highlight ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`} style={{ marginBottom: 12 }}>
        <View className="flex-1">
            <Text className="text-sm text-gray-600 mb-1">{label}</Text>
            <Text className={`font-mono font-semibold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>
                {value}
            </Text>
        </View>
        {onCopy && (
            <TouchableOpacity onPress={() => onCopy(value, label)} className="p-2">
                <Ionicons name="copy-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
        )}
    </View>
)

const PickerModal = ({ visible, onClose, title, options, selectedValue, onSelect }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl max-h-[70%]">
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Text className="text-lg font-bold text-gray-900">{title}</Text>
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                </View>
                <ScrollView className="px-6 py-2">
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onSelect(option.value)}
                            className={`py-4 border-b border-gray-100 ${selectedValue === option.value ? 'bg-orange-50' : ''}`}
                        >
                            <View className="flex-row items-center justify-between">
                                <Text className={`text-base ${selectedValue === option.value ? 'text-orange-600 font-semibold' : 'text-gray-900'}`}>
                                    {option.label}
                                </Text>
                                {selectedValue === option.value && (
                                    <Ionicons name="checkmark-circle" size={24} color="#f97316" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View className="h-8" />
                </ScrollView>
            </View>
        </View>
    </Modal>
)

export default NewAccount
