import { api } from './api';
import { Apartment } from '../types';

export const savedApartmentService = {
  async getSavedApartments(): Promise<Apartment[]> {
    const res = await api.get('/saved-apartments');
    return res.data.data;
  },

  async saveApartment(apartmentId: string) {
    const res = await api.post(`/saved-apartments/${apartmentId}`);
    return res.data;
  },

  async removeSavedApartment(apartmentId: string) {
    const res = await api.delete(`/saved-apartments/${apartmentId}`);
    return res.data;
  },
};
