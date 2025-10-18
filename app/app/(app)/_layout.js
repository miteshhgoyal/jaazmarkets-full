import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { useTheme } from '@/context/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function AppLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textTertiary,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                    paddingTop: 8,
                    backgroundColor: theme.bgPrimary,
                    borderTopColor: theme.borderPrimary,
                    borderTopWidth: 1,
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                },
                tabBarLabelStyle: {
                    fontWeight: '600',
                    fontSize: 10,
                    marginTop: 2
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    switch (route.name) {
                        case 'tabs/accounts':
                            iconName = focused ? 'grid' : 'grid-outline';
                            break;
                        case 'tabs/trade':
                            iconName = focused ? 'analytics' : 'analytics-outline';
                            break;
                        case 'tabs/insights':
                            iconName = focused ? 'globe' : 'globe-outline';
                            break;
                        case 'tabs/performance':
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                            break;
                        case 'tabs/profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'aperture-outline';
                    }
                    return <Ionicons name={iconName} size={22} color={color} />;
                }
            })}
        >
            <Tabs.Screen
                name="tabs/accounts"
                options={{ title: 'Accounts' }}
            />
            <Tabs.Screen
                name="tabs/performance"
                options={{ title: 'Performance' }}
            />
            <Tabs.Screen
                name="tabs/profile"
                options={{ title: 'Profile' }}
            />

            {/* Hidden screens */}
            <Tabs.Screen
                name="new-account"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="edit-profile"
                options={{ href: null }}
            />
        </Tabs>
    );
}
