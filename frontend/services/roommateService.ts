import { api } from './api';
import { MatchItem } from '../types';

export const roommateService = {
  async getRoommates(params?: Record<string, any>) {
    const res = await api.get('/roommates', { params });
    return res.data.data;
  },

  async getRoommateById(id: string): Promise<MatchItem> {
    const res = await api.get(`/roommates/${id}`);
    return res.data.data;
  },

  async getRecommendations(): Promise<MatchItem[]> {
    const res = await api.get('/roommates/recommendations');
    return res.data.data;
  },
};
