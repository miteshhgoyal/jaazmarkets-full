import axios from 'axios';
import { tokenService } from './tokenService'; // Add this import

const API_BASE_URL = 'http://192.168.1.66:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const PUBLIC_ROUTES = [
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/api/health'
];

// Updated request interceptor
api.interceptors.request.use(
    async (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);

        const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));

        if (!isPublicRoute) {
            try {
                // Use tokenService instead of directly accessing AsyncStorage
                const token = await tokenService.getToken();
                if (token && typeof token === 'string' && token.length > 0) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Token attached:', token.substring(0, 20) + '...'); // Debug log
                } else {
                    console.log('No token found'); // Debug log
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

// Updated response interceptor
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
            // Use tokenService to clear tokens
            await tokenService.clearTokens();
        }
        return Promise.reject(error);
    }
);

export default api;
