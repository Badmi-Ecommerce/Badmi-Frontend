import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export type MessageData = { message: string; verifyUrl?: string | null };

const authApi = {
  async login(data: LoginRequest) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.LOGIN, data)) as AuthResponse;
  },

  async register(data: RegisterRequest) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.REGISTER, data)) as MessageData;
  },

  async loginWithGoogle(idToken: string) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.GOOGLE, { idToken })) as AuthResponse;
  },

  async verifyEmail(token: string) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.VERIFY_EMAIL, { token })) as MessageData;
  },

  async resendVerification(email: string) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.RESEND_VERIFICATION, { email })) as MessageData;
  },

  async forgotPassword(email: string) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email })) as MessageData;
  },

  async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    return unwrap(
      await axiosClient.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword, confirmPassword })
    ) as MessageData;
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return unwrap(
      await axiosClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      })
    ) as MessageData;
  },

  async logout() {
    return unwrap(await axiosClient.post(API_ENDPOINTS.LOGOUT));
  },

  async getMe() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ME)) as User;
  },

  async becomeOwner() {
    return unwrap(await axiosClient.post(API_ENDPOINTS.BECOME_OWNER)) as User;
  },
};

export default authApi;
