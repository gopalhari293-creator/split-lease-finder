import { api } from './api';
import { MatchItem, CombinedMatch } from '../types';

export const matchService = {
  async getMatches(): Promise<MatchItem[]> {
    const res = await api.get('/matches');
    return res.data.data;
  },

  async getCombinedMatches(): Promise<CombinedMatch[]> {
    const res = await api.get('/matches/combined');
    return res.data.data;
  },

  async updateStatus(matchedUserId: string, status: string) {
    const res = await api.post('/matches/status', { matchedUserId, status });
    return res.data.data;
  },
};
