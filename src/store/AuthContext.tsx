import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import authApi from '../api/authApi';
import type { MessageData } from '../api/authApi';
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
  register: (data: RegisterRequest) => Promise<MessageData>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  becomeOwner: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const restore = async () => {
      const token = tokenService.getToken();
      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      try {
        const user = await authApi.getMe();
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        tokenService.removeToken();
        localStorage.removeItem(STORAGE_KEYS.USER);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    void restore();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const { token, user } = await authApi.login(data);
    tokenService.setToken(token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    toast.success(`Chào mừng trở lại, ${user.name}!`);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const result = await authApi.register(data);
    toast.success(result.message || 'Đăng ký thành công. Vui lòng xác thực email.');
    return result;
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const { token, user } = await authApi.loginWithGoogle(idToken);
    tokenService.setToken(token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    toast.success(`Chào mừng, ${user.name}!`);
  }, []);

  const becomeOwner = useCallback(async () => {
    const user = await authApi.becomeOwner();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    toast.success('Đã mở kênh bán hàng. Bạn có thể đăng sản phẩm cầu lông của mình.');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    tokenService.removeToken();
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
    toast.success('Đã đăng xuất thành công.');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, becomeOwner, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook is the public API of this module; Fast Refresh still applies to AuthProvider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
