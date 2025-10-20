import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'http://192.168.1.66:8000';
// const API_BASE_URL = 'https://jaazmarkets-server.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const PUBLIC_ROUTES = [
    '/auth/signup',
    '/auth/signin',
    '/auth/verify-email-otp',
    '/auth/resend-verification-otp',
    '/auth/forgot-password',
    '/auth/verify-reset-otp',
    '/auth/reset-password',
    '/health'
];

// Store logout callback
let logoutCallback = null;

export const setLogoutCallback = (callback) => {
    logoutCallback = callback;
};

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));

        if (!isPublicRoute) {
            try {
                const token = await tokenService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Token error:', error.message);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Simply return response without any processing
        return response;
    },
    async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            try {
                await tokenService.clearTokens();
                if (logoutCallback) {
                    logoutCallback();
                }
            } catch (e) {
                console.error('Logout error:', e.message);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
