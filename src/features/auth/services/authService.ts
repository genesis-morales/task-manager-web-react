import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  LoginResponse,
  RegisterResponse,
  LoginRequest,
  RegisterRequest,
  User,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
} from '../types/authTypes';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 interceptor — only redirect for protected endpoints
const PUBLIC_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/reset-password'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((ep) => requestUrl.includes(ep));

    if (error.response?.status === 401 && !isPublicEndpoint) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/api/v1/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>('/api/v1/auth/register', data),

  getMe: () =>
    api.get<User>('/api/v1/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post<LoginResponse>('/api/v1/auth/refresh-token', { refresh_token: refreshToken }),

  requestPasswordReset: (data: PasswordResetRequest) =>
    api.post('/api/v1/auth/reset-password/request', data),

  confirmPasswordReset: (data: PasswordResetConfirmRequest) =>
    api.post('/api/v1/auth/reset-password/confirm', data),
};
