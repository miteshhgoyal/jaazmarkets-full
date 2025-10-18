import React, { useEffect, useRef } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar, BackHandler, ToastAndroid, Platform } from 'react-native';
import { AuthContextProvider, useAuth } from '@/context/authContext';
import { ThemeProvider } from '@/context/themeContext';
import './globals.css';
import { SafeAreaView } from 'react-native-safe-area-context';

function MainLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const backPressedOnce = useRef(false);

    useEffect(() => {
        if (typeof isAuthenticated === 'undefined' || isLoading) return;

        const inAuth = segments[0] === '(auth)';
        const inApp = segments[0] === '(app)';

        if (isAuthenticated && !inApp) {
            setTimeout(() => {
                router.replace('/tabs/accounts');
            }, 0);
        } else if (!isAuthenticated && !inAuth) {
            setTimeout(() => {
                router.replace('/(auth)/signin');
            }, 0);
        }
    }, [isAuthenticated, isLoading]);

    useEffect(() => {
        const backAction = () => {
            const isHome = segments[0] === '(app)' && segments[1] === 'tabs' && segments[2] === 'home';

            if (isHome) {
                if (backPressedOnce.current) {
                    BackHandler.exitApp();
                    return true;
                } else {
                    backPressedOnce.current = true;
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                    }
                    setTimeout(() => { backPressedOnce.current = false; }, 2000);
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
                animation: 'slide_from_right'
            }}
            initialRouteName="index"
        />
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthContextProvider>
                <SafeAreaView style={{ flex: 0, backgroundColor: 'transparent' }}>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent={true}
                    />
                </SafeAreaView>
                <MainLayout />
            </AuthContextProvider>
        </ThemeProvider>
    );
}
