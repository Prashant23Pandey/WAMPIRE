import axios from 'axios';

// Centralized API configuration (supports VITE_API_URL and VITE_API_BASE_URL)
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
const baseURL = rawBaseURL.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wampire_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error unwrapping
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Session expiration handling
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('wampire_token');
        localStorage.removeItem('wampire_user');
      }
    }

    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Unable to communicate with the server. Please check your network connection.',
      errors: error.response?.data?.errors || null,
    };

    return Promise.reject(customError);
  }
);

export default apiClient;

