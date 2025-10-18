import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL || 'https://jaazmarkets-backend.onrender.com',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple simultaneous refresh requests
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
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with auto token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loops on auth endpoints
        const authEndpoints = [
            '/auth/refresh-token',
            '/auth/signin',
            '/auth/signup',
            '/auth/forgot-password',
            '/auth/reset-password'
        ];

        if (authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
            return Promise.reject(error);
        }

        // If 401 and haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenService.getRefreshToken();

            if (!refreshToken) {
                isRefreshing = false;
                tokenService.clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Use /auth/refresh-token endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_API_URL || 'https://jaazmarkets-backend.onrender.com'}/auth/refresh-token`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { accessToken } = response.data.data;
                tokenService.setToken(accessToken);

                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                processQueue(refreshError, null);
                tokenService.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
