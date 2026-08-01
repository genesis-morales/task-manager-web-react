import type { RootState } from './store';
import type { User } from '../features/auth/types/authTypes';

export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState): boolean => state.auth.isLoading;