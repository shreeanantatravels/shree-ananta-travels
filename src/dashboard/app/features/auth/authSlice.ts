"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  isOnboarded: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('ananda_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ananda_token');
};

const initialUser = getUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('ananda_user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('ananda_user');
        }
      }
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('ananda_token', action.payload);
        } else {
          localStorage.removeItem('ananda_token');
        }
      }
    },
    updateOnboardingStatus(state, action: PayloadAction<boolean>) {
      if (state.user) {
        state.user.isOnboarded = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('ananda_user', JSON.stringify(state.user));
        }
      }
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ananda_user');
        localStorage.removeItem('ananda_token');
      }
    },
  },
});

export const { setUser, setToken, updateOnboardingStatus, clearAuth } = authSlice.actions;
export default authSlice.reducer;
