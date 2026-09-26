import { api } from './api';
import { User, RoommateProfile } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async logout() {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<{ user: User; profile: RoommateProfile }> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  async updateProfile(data: any) {
    const res = await api.put('/profile', data);
    return res.data.data;
  },

  async getProfile(userId?: string) {
    const url = userId ? `/profile/${userId}` : '/profile';
    const res = await api.get(url);
    return res.data.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(data: { token: string; newPassword: string }) {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },
};
