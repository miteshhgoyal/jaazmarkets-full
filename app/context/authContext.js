import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    

    useEffect(() => {
        checkAuthState();
        
    }, []);

    const checkAuthState = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedUser = await AsyncStorage.getItem('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth state check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (authToken, userData) => {
        try {
            await AsyncStorage.setItem('authToken', authToken);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Failed to save login data' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');

            setToken(null);
            setUser(null);
            setIsAuthenticated(false);

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Failed to logout' };
        }
    };

    const updateUser = async (updatedData) => {
        try {
            const newUserData = { ...user, ...updatedData };
            await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
            setUser(newUserData);
            return { success: true };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, message: 'Failed to update user data' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        token,        
        login,
        logout,
        updateUser,
        checkAuthState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be wrapped inside the AuthContextProvider');
    }
    return value;
};
