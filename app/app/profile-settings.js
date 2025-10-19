import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'

const ProfileSettings = () => {
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.get('/user/profile')
            if (response.data.success) {
                setProfileData(response.data.data)
            } else {
                setError(response.data.message)
                Alert.alert('Error', response.data.message)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load profile'
            setError(errorMsg)
            Alert.alert('Error', errorMsg)
            console.error('Fetch profile error:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchProfile()
    }, [])

    if (loading && !profileData) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading profile...</Text>
            </View>
        )
    }

    if (error && !profileData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                        Error Loading Profile
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">{error}</Text>
                    <TouchableOpacity
                        onPress={fetchProfile}
                        className="bg-orange-500 px-6 py-3 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#f97316']}
                        tintColor="#f97316"
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
            >
                {profileData && (
                    <>
                        {/* Status Cards */}
                        <View className="mb-6">
                            <ProfileStatusCard data={profileData.status} />
                            <View className="h-3" />
                            <ProfileStatusCard data={profileData.depositLimit} />
                        </View>

                        {/* Verification Steps */}
                        <View>
                            <Text className="text-xl font-bold text-gray-900 mb-4">
                                Verification Steps
                            </Text>
                            <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {profileData.verificationSteps.map((step, index) => (
                                    <React.Fragment key={index}>
                                        <View className="flex-row items-center justify-between p-5">
                                            {/* Left Section */}
                                            <View className="flex-row items-center flex-1 mr-3">
                                                <View className="w-7 h-7 bg-gray-600 rounded-full items-center justify-center mr-3">
                                                    <Text className="text-white text-xs font-bold">
                                                        {step.count}
                                                    </Text>
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-sm font-semibold text-gray-900 mb-0.5">
                                                        {step.heading}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500">
                                                        {step.value}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Status Badge */}
                                            <View
                                                className={`px-3 py-1.5 rounded-full ${step.status === 'Pending'
                                                        ? 'bg-orange-100'
                                                        : step.status === 'Completed'
                                                            ? 'bg-green-100'
                                                            : 'bg-gray-100'
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-xs font-semibold ${step.status === 'Pending'
                                                            ? 'text-orange-800'
                                                            : step.status === 'Completed'
                                                                ? 'text-green-800'
                                                                : 'text-gray-800'
                                                        }`}
                                                >
                                                    {step.status}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Divider */}
                                        {index < profileData.verificationSteps.length - 1 && (
                                            <View className="h-px bg-gray-200 ml-16" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

// Profile Status Card Component
const ProfileStatusCard = ({ data }) => (
    <View className="p-5 rounded-xl border border-gray-200 bg-white">
        <Text className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{data.heading}</Text>
        <Text
            className={`text-2xl font-bold mb-1 ${data.value === 'Verified'
                    ? 'text-green-600'
                    : data.value === 'Unverified'
                        ? 'text-yellow-600'
                        : 'text-gray-900'
                }`}
        >
            {data.value}
        </Text>
        <Text className="text-xs text-gray-400 leading-4">{data.subheading}</Text>
    </View>
)

export default ProfileSettings
