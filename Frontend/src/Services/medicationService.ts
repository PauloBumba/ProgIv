import { api } from '../Api/api';

export const medicationService = {
  getAll: () => api.get('/Medications'),
  getById: (id: number) => api.get(`/Medications/${id}`),
  create: (data: any) => api.post('/Medications', data),
  update: (id: number, data: any) => api.put(`/Medications/${id}`, data),
  delete: (id: number) => api.delete(`/Medications/${id}`),
  addSchedule: (medicationId: number, data: any) =>
    api.post(`/Medications/${medicationId}/schedule`, data),
  markTaken: (scheduleId: number) =>
    api.post(`/Medications/mark-taken/${scheduleId}`),
};
