import axios, { AxiosError } from 'axios';
import tokenService from '../services/tokenService';
import toast from 'react-hot-toast';
import { STORAGE_KEYS } from '../constants';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const fieldErrors = error.response?.data?.errors;

    if (status === 401) {
      const url = error.config?.url ?? '';
      const isAuthAttempt = /\/api\/auth\/(login|register|google|forgot-password|reset-password|verify-email|resend-verification|change-password)/.test(url);
      if (!isAuthAttempt) {
        tokenService.removeToken();
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/dang-nhap';
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else if (message) {
        toast.error(message);
      }
    } else if (status === 403) {
      toast.error(message || 'Bạn không có quyền thực hiện thao tác này.');
    } else if (status === 404) {
      toast.error(message || 'Không tìm thấy tài nguyên yêu cầu.');
    } else if (status === 409) {
      toast.error(message || 'Dữ liệu vừa được cập nhật. Vui lòng thử lại.');
    } else if (status === 429) {
      toast.error(message || 'Quá nhiều lần thử. Vui lòng thử lại sau.');
    } else if (status && status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
    } else if (status === 400 && fieldErrors && Object.keys(fieldErrors).length > 0) {
      // Field errors are shown under inputs; skip a duplicate toast.
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
