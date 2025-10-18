import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenService = {
    setToken: async (token) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    },

    getToken: async () => {
        try {
            return await AsyncStorage.getItem('token');
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    },

    removeToken: async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'user']);
        } catch (error) {
            console.error('Error removing tokens:', error);
        }
    },

    isTokenExpired: (token) => {
        // Check if token exists and is a string
        if (!token || typeof token !== 'string') {
            console.log('Token is invalid or missing');
            return true;
        }

        try {
            // JWT tokens have 3 parts separated by dots
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.log('Invalid JWT token format');
                return true;
            }

            // Decode the payload (second part)
            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Date.now() / 1000;

            // Check if token has expiration time
            if (!payload.exp) {
                console.log('Token does not have expiration time');
                return false; // Consider non-expiring token as valid
            }

            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    },

    // Helper method for getting token synchronously when you already have it
    isTokenValid: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            return !tokenService.isTokenExpired(token);
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }
};
