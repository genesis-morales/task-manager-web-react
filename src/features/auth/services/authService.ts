import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User, PasswordResetRequest, PasswordResetConfirmRequest } from "../types/authTypes";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    accept: 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/api/v1/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/api/v1/auth/register', data),
  getMe: () => api.get<User>('/api/v1/auth/me'),
requestPasswordReset: (data: PasswordResetRequest) => api.post('/api/v1/auth/reset-password/request', data),
confirmPasswordReset: (data: PasswordResetConfirmRequest) => api.post('/api/v1/auth/reset-password/confirm', data),
};