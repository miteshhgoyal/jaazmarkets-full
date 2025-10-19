import axios from 'axios';
import { tokenService } from './tokenService';

// const API_BASE_URL = 'http://192.168.1.66:8000';
const API_BASE_URL = 'https://jaazmarkets-server.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
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
    '/auth/refresh',
    '/health'
];

// Store logout callback
let logoutCallback = null;

export const setLogoutCallback = (callback) => {
    logoutCallback = callback;
};

// Refresh token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);

        const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));

        if (!isPublicRoute) {
            try {
                const token = await tokenService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('✅ Token attached');
                } else {
                    console.warn('⚠️ No token found for protected route');
                }
            } catch (error) {
                console.error('❌ Error getting token:', error);
            }
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error('❌ Response Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message || error.message
        });

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If refresh endpoint itself failed, logout
            if (originalRequest.url?.includes('/auth/refresh')) {
                console.log('🔴 Refresh token expired - forcing logout');
                isRefreshing = false;
                await tokenService.clearTokens();

                if (logoutCallback) {
                    logoutCallback();
                }

                processQueue(error, null);
                return Promise.reject(error);
            }

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await tokenService.getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                console.log('🔄 Attempting to refresh access token...');

                // Call YOUR backend refresh endpoint
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                if (response.data.success) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                    // Save new tokens
                    await tokenService.setToken(accessToken);
                    if (newRefreshToken) {
                        await tokenService.setRefreshToken(newRefreshToken);
                    }

                    console.log('✅ Token refreshed successfully');

                    // Update original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    // Process all queued requests
                    processQueue(null, accessToken);

                    isRefreshing = false;

                    // Retry the original request
                    return api(originalRequest);
                } else {
                    throw new Error('Refresh failed');
                }

            } catch (refreshError) {
                console.error('🔴 Token refresh failed:', refreshError.response?.data || refreshError.message);

                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear tokens and force logout
                await tokenService.clearTokens();

                if (logoutCallback) {
                    logoutCallback();
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
