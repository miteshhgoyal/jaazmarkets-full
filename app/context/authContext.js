import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { tokenService } from '@/services/tokenService';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await tokenService.getToken();
            const refreshToken = await tokenService.getRefreshToken();

            if (token && refreshToken) {
                setIsAuthenticated(true);

                // Load user data from AsyncStorage if stored
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await tokenService.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        try {
            const { accessToken, refreshToken, user } = userData;

            // Store tokens
            await tokenService.setToken(accessToken);
            await tokenService.setRefreshToken(refreshToken);

            // Store user if provided
            if (user) {
                setUser(user);
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }

            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Failed to save login data' };
        }
    };

    const logout = async () => {
        try {
            // Optional: Call backend logout endpoint
            const refreshToken = await tokenService.getRefreshToken();
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken }).catch(() => {
                    // Ignore errors
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await tokenService.clearTokens();
            await AsyncStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);

            // Navigate to login screen
            router.replace('/login');
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
