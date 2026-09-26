import { api } from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data.data;
  },

  async getUsers(params?: Record<string, any>) {
    const res = await api.get('/admin/users', { params });
    return res.data.data;
  },

  async deleteUser(id: string) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};
