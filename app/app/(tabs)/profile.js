import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/authContext'

const Profile = () => {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 1000)
    }, [])

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout()
                            router.replace('/(auth)/signin')
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout')
                        }
                    },
                },
            ]
        )
    }

    const menuItems = [
        {
            section: 'Account Settings',
            items: [
                {
                    id: 'profile-settings',
                    label: 'Profile',
                    icon: 'person-outline',
                    route: '/profile-settings',
                    description: 'Manage your profile & verification',
                },
                {
                    id: 'security',
                    label: 'Security',
                    icon: 'shield-checkmark-outline',
                    route: '/security',
                    description: 'Password & security settings',
                },
            ],
        },
        {
            section: 'Trading',
            items: [
                {
                    id: 'history',
                    label: 'History of Orders',
                    icon: 'time-outline',
                    route: '/history-orders',
                    description: 'View your trading history',
                },
            ],
        },
        {
            section: 'Payments & Transfers',
            items: [
                {
                    id: 'deposit',
                    label: 'Deposit',
                    icon: 'arrow-down-circle-outline',
                    route: '/deposit',
                    description: 'Add funds to your account',
                    color: '#10b981',
                    bgColor: '#d1fae5',
                },
                {
                    id: 'withdrawal',
                    label: 'Withdrawal',
                    icon: 'arrow-up-circle-outline',
                    route: '/withdrawal',
                    description: 'Withdraw your funds',
                    color: '#f97316',
                    bgColor: '#ffedd5',
                },
                {
                    id: 'transfer',
                    label: 'Transfer',
                    icon: 'swap-horizontal-outline',
                    route: '/transfer',
                    description: 'Transfer between accounts',
                    color: '#3b82f6',
                    bgColor: '#dbeafe',
                },
                {
                    id: 'transactions',
                    label: 'Transaction History',
                    icon: 'receipt-outline',
                    route: '/transactions',
                    description: 'View all transactions',
                },
            ],
        },
        {
            section: 'More',
            items: [
                {
                    id: 'refer',
                    label: 'Refer & Earn',
                    icon: 'gift-outline',
                    route: '/refer-earn',
                    description: 'Invite friends & earn rewards',
                    // badge: 'New',
                    color: '#8b5cf6',
                    bgColor: '#ede9fe',
                },
                {
                    id: 'education',
                    label: 'Education',
                    icon: 'school-outline',
                    route: '/education',
                    description: 'Learn trading strategies',
                },
            ],
        },
    ]

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f97316']} />
                }
            >
                {/* Profile Header */}
                <View className="px-6 pt-8">
                    <View className="flex-row items-center">
                        <View className="w-20 h-20 rounded-full bg-white border border-orange-500 items-center justify-center mr-4">
                            <Text className="text-3xl font-bold text-orange-500">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-black mb-1">
                                {user?.name || 'User'}
                            </Text>
                            <Text className="text-black opacity-90 text-sm">
                                {user?.email || 'user@example.com'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu Sections */}
                <View className="px-6 py-6">
                    {menuItems.map((section, sectionIndex) => (
                        <View key={sectionIndex} className="mb-6">
                            <Text className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                                {section.section}
                            </Text>
                            <View className="bg-white rounded-xl overflow-hidden border border-gray-200">
                                {section.items.map((item, itemIndex) => (
                                    <React.Fragment key={item.id}>
                                        <TouchableOpacity
                                            onPress={() => router.push(item.route)}
                                            className="flex-row items-center px-4 py-4"
                                            activeOpacity={0.7}
                                        >
                                            <View
                                                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                                style={{ backgroundColor: item.bgColor || '#f3f4f6' }}
                                            >
                                                <Ionicons
                                                    name={item.icon}
                                                    size={22}
                                                    color={item.color || '#6b7280'}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <View className="flex-row items-center">
                                                    <Text className="text-base font-semibold text-gray-900">
                                                        {item.label}
                                                    </Text>
                                                    {item.badge && (
                                                        <View className="ml-2 px-2 py-0.5 bg-orange-100 rounded-full">
                                                            <Text className="text-xs font-semibold text-orange-600">
                                                                {item.badge}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className="text-xs text-gray-500 mt-0.5">
                                                    {item.description}
                                                </Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                                        </TouchableOpacity>
                                        {itemIndex < section.items.length - 1 && (
                                            <View className="h-px bg-gray-100 ml-16" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Logout Button */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-50/60 border border-red-200 rounded-xl py-4 items-center flex-row justify-center"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={22} color="#dc2626" />
                        <Text className="text-red-600 font-semibold ml-2 text-base">Logout</Text>
                    </TouchableOpacity>

                    <View className="mt-6 items-center">
                        <Text className="text-xs text-gray-400">Version 1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile
