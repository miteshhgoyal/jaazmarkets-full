import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#f97316',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                    paddingTop: 8,
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e2e8f0',
                    borderTopWidth: 1,
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontWeight: '600',
                    fontSize: 11,
                    marginTop: 2
                },
            }}
        >
            <Tabs.Screen
                name="accounts"
                options={{
                    title: 'Accounts',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="performance"
                options={{
                    title: 'Performance',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
