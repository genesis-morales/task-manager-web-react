import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authService';
import type { AuthState, User } from '../types/authTypes';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const setAuthenticated = useCallback((user: User, accessToken: string) => {
    setState({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const setUnauthenticated = useCallback(() => {
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Initialize: check if we have a stored token and validate with /me
  const initializeAuth = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setUnauthenticated();
      return;
    }

    try {
      const response = await authApi.getMe();
      setAuthenticated(response.data, accessToken);
    } catch {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUnauthenticated();
    }
  }, [setAuthenticated, setUnauthenticated]);

  // Login: POST /api/v1/auth/login → { accessToken, refreshToken, tokenType, expiresIn }
  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Fetch user profile
      try {
        const meResponse = await authApi.getMe();
        setAuthenticated(meResponse.data, accessToken);
      } catch {
        // /me failed but login succeeded — set minimal auth state
        setAuthenticated({ id: '', email, username: '', createdAt: '' }, accessToken);
      }

      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const detail = error.response?.data?.detail;
      return {
        success: false,
        error: typeof detail === 'string' ? detail : 'Invalid credentials',
      };
    }
  }, [setAuthenticated]);

  // Register: POST /api/v1/auth/register → { id, username, email, createdAt }
  const register = useCallback(async (email: string, username: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await authApi.register({ email, username, password });
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const detail = error.response?.data?.detail;
      return {
        success: false,
        error: typeof detail === 'string' ? detail : 'Registration failed',
      };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUnauthenticated();
  }, [setUnauthenticated]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    ...state,
    login,
    register,
    logout,
  };
};
