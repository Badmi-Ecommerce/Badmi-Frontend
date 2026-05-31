import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import authApi from '../api/authApi';
import tokenService from '../services/tokenService';
import { STORAGE_KEYS } from '../constants';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore user from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    const token = tokenService.getToken();
    if (stored && token) {
      try {
        const user: User = JSON.parse(stored);
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    console.log('Login attempt:', data);
    const response = await authApi.login(data);
    console.log('Login response:', response);
    const { token, user } = response.data;
    console.log('Token:', token, 'User:', user);
    tokenService.setToken(token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    console.log('Login successful, navigating to home');
    toast.success(`Chào mừng trở lại, ${user.name}!`);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    const { token, user } = response.data;
    tokenService.setToken(token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    toast.success('Đăng ký thành công!');
  }, []);

  const logout = useCallback(() => {
    tokenService.removeToken();
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
    toast.success('Đã đăng xuất thành công.');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
