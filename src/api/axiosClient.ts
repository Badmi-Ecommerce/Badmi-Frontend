import axios, { AxiosError } from 'axios';
import tokenService from '../services/tokenService';
import toast from 'react-hot-toast';

// =============================================
// Axios client centralized instance
// =============================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────
// Automatically attaches JWT token to every request
axiosClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────
// Global error handling: 401 -> logout, 5xx -> toast
axiosClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    console.error('API Error:', error.response?.status, error.config?.method?.toUpperCase(), error.config?.url, error.response?.data);
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      tokenService.removeToken();
      localStorage.removeItem('badmishop_user');
      window.location.href = '/dang-nhap';
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    } else if (status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này.');
    } else if (status === 404) {
      toast.error(message || 'Không tìm thấy tài nguyên yêu cầu.');
    } else if (status && status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
