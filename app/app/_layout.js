import React, { useEffect, useRef } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar, BackHandler, ToastAndroid, Platform } from 'react-native';
import { AuthProvider, useAuth } from '@/context/authContext';
import './globals.css';

function MainLayout() {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const backPressedOnce = useRef(false);

    // Auth-based navigation
    useEffect(() => {
        if (loading) return;

        const inAuth = segments[0] === '(auth)';
        const inTabs = segments[0] === '(tabs)';

        const authenticatedRoutes = [
            'new-account',
            'profile-settings',
            'security',
            'history-orders',
            'deposit',
            'withdrawal',
            'transfer',
            'transactions',
            'refer-earn',
            'education',
        ];
        const inAuthenticatedRoute = authenticatedRoutes.includes(segments[0]);

        if (isAuthenticated && !inTabs && !inAuthenticatedRoute) {
            router.replace('/(tabs)/accounts');
        } else if (isAuthenticated === false && !inAuth) {
            router.replace('/(auth)/signin');
        }
    }, [isAuthenticated, loading, segments]);

    // Back button handler
    useEffect(() => {
        const backAction = () => {
            const isOnAccountsTab =
                segments[0] === '(tabs)' &&
                segments[1] === 'accounts';

            if (isOnAccountsTab) {
                if (backPressedOnce.current) {
                    BackHandler.exitApp();
                    return true;
                } else {
                    backPressedOnce.current = true;
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                    }
                    setTimeout(() => {
                        backPressedOnce.current = false;
                    }, 2000);
                    return true;
                }
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [segments]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: {
                    backgroundColor: 'white',
                }
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />

            {/* ✅ FIXED: Changed from modal to regular screen with header */}
            <Stack.Screen
                name="new-account"
                options={{
                    headerShown: true,
                    title: 'Create New Account',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    animation: 'slide_from_right',  // Changed from slide_from_bottom
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />

            <Stack.Screen
                name="profile-settings"
                options={{
                    headerShown: true,
                    title: 'Profile',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Stack.Screen
                name="security"
                options={{
                    headerShown: true,
                    title: 'Security',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />

            <Stack.Screen
                name="history-orders"
                options={{
                    headerShown: true,
                    title: 'Order History',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />

            <Stack.Screen
                name="deposit"
                options={{
                    headerShown: true,
                    title: 'Deposit',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Stack.Screen
                name="withdrawal"
                options={{
                    headerShown: true,
                    title: 'Withdrawal',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Stack.Screen
                name="transfer"
                options={{
                    headerShown: true,
                    title: 'Transfer',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Stack.Screen
                name="transactions"
                options={{
                    headerShown: true,
                    title: 'Transactions',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />

            <Stack.Screen
                name="refer-earn"
                options={{
                    headerShown: true,
                    title: 'Refer & Earn',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Stack.Screen
                name="education"
                options={{
                    headerShown: true,
                    title: 'Education',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: 'white',
                    }
                }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
                translucent={false}
            />
            <MainLayout />
        </AuthProvider>
    );
}
