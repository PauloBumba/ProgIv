import { api } from '../Api/api';

export const scheduleService = {
  getByMedication: (medicationId: number) =>
    api.get(`/Schedules/by-medication/${medicationId}`),
  create: (scheduleData: any) => api.post('/Schedules', scheduleData),
  update: (scheduleId: number, scheduleData: any) =>
    api.put(`/Schedules/${scheduleId}`, scheduleData),
  delete: (scheduleId: number) => api.delete(`/Schedules/${scheduleId}`),
  markTaken: (scheduleId: number) =>
    api.post(`/Schedules/mark-taken/${scheduleId}`),
  getHistory: (medicationId: number) =>
    api.get(`/Schedules/${medicationId}`)
};
