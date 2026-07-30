import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authService';
import type { AuthState, User, AuthTokens } from '../types/authTypes';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const setAuthState = useCallback((user: User | null, tokens: AuthTokens | null) => {
    setState({
      user,
      tokens,
      isAuthenticated: !!user && !!tokens,
      isLoading: false,
    });
  }, []);

  const initializeAuth = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      setAuthState(null, null);
      return;
    }

    try {
      // Llama al endpoint /me — el interceptor añade el token automáticamente
      const response = await authApi.getMe();
      setAuthState(response.data, {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 86400,
      });
    } catch {
      // Token expirado o inválido — limpia la sesión
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAuthState(null, null);
    }
  }, [setAuthState]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login({ email, password });

      localStorage.setItem('access_token', response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);

      setAuthState(response.data.user, response.data.tokens);
      return { success: true, data: response.data };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  }, [setAuthState]);

const register = useCallback(async (email: string, username: string, password: string) => {
  try {
    setState(prev => ({ ...prev, isLoading: true }));
    await authApi.register({ email, username, password });

    setState(prev => ({ ...prev, isLoading: false }));
    return { success: true };
  } catch (error: any) {
    setState(prev => ({ ...prev, isLoading: false }));
    return {
      success: false,
      error: error.response?.data?.detail || 'Registration failed',
    };
  }
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthState(null, null);
  }, [setAuthState]);

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