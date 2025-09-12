import { api } from '../Api/api';

export const medicationService = {
  getAll: () => api.get('/Medications'),
  getById: (id: string) => api.get(`/Medications/${id}`),
  create: (data: any) => api.post('/Medications', data),
  update: (id: string, data: any) => api.put(`/Medications/${id}`, data),
  delete: (id: string) => api.delete(`/Medications/${id}`),
  addSchedule: (medicationId: string, data: any) =>
    api.post(`/Medications/${medicationId}/schedule`, data),
  markTaken: (scheduleId: string) =>
    api.post(`/Medications/mark-taken/${scheduleId}`),
};
