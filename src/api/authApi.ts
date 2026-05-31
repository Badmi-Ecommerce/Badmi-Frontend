import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

const authApi = {
  login(data: LoginRequest) {
    return axiosClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
  },

  register(data: RegisterRequest) {
    return axiosClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
  },

  logout() {
    return axiosClient.post(API_ENDPOINTS.LOGOUT);
  },

  getMe() {
    return axiosClient.get<User>(API_ENDPOINTS.ME);
  },
};

export default authApi;
