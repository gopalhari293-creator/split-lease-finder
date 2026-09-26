import { api } from './api';
import { Apartment } from '../types';

export const apartmentService = {
  async getApartments(params?: Record<string, any>) {
    const res = await api.get('/apartments', { params });
    return res.data.data;
  },

  async getApartmentById(id: string) {
    const res = await api.get(`/apartments/${id}`);
    return res.data.data;
  },

  async createApartment(data: Partial<Apartment>) {
    const res = await api.post('/apartments', data);
    return res.data.data;
  },

  async updateApartment(id: string, data: Partial<Apartment>) {
    const res = await api.put(`/apartments/${id}`, data);
    return res.data.data;
  },

  async deleteApartment(id: string) {
    const res = await api.delete(`/apartments/${id}`);
    return res.data;
  },
};
