import axios from 'axios';

// ✅ Gunakan import.meta.env untuk Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Navigation callback for auth redirects
let authRedirectCallback: ((path: string) => void) | null = null;

export function setAuthRedirectCallback(callback: (path: string) => void) {
  authRedirectCallback = callback;
}

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (authRedirectCallback) {
        authRedirectCallback('/login');
      } else {
        window.location.href = '/login'; // fallback for non-React environments
      }
    }
    return Promise.reject(error);
  }
);

// Prediction services
export const predictionService = {
  predict: (formData: FormData) => {
    return api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getHistory: () => {
    return api.get('/predict/history');
  },
};

// Auth services
export const authService = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },
};

export default api;
