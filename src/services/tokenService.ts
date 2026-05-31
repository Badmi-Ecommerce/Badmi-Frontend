import { STORAGE_KEYS } from '../constants';

const tokenService = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default tokenService;
