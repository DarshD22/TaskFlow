import api, { setTokens, clearTokens } from './api';
import { AuthResponse, User } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/register', { name, email, password });
    const data: AuthResponse = res.data.data;
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', { email, password });
    const data: AuthResponse = res.data.data;
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      clearTokens();
    }
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};