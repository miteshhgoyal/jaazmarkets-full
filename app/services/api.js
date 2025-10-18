import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.83:5000';
// const API_BASE_URL = 'https://jaaz-app-backend.onrender.com';

// Create axios instance with proper base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Routes that don't require authentication
const PUBLIC_ROUTES = [
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/api/health'
];

// Add request interceptor for debugging
api.interceptors.request.use(
    async (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);

        // Skip token check for public routes
        const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));

        if (!isPublicRoute) {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token && typeof token === 'string' && token.length > 0) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error getting token:', error);
            }
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        console.error('Response Error:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            try {
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('userData');
            } catch (clearError) {
                console.error('Error clearing storage:', clearError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
