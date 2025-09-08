import { api } from '../Api/api';

export const expenseRequestService = {
  create: (formData: FormData) => api.post('/ExpenseRequest/create', formData),
  approve: (id: string) => api.post(`/ExpenseRequest/${id}/approve`),
  cancel: (id: string) => api.post(`/ExpenseRequest/${id}/cancel`),
  pay: (id: string) => api.post(`/ExpenseRequest/${id}/pay`),
  getById: (id: string) => api.get(`/ExpenseRequest/${id}`),
  getAll: () => api.get('/ExpenseRequest'),
   getMine: () => api.get('/ExpenseRequest/minhas-despesas'),
  delete: (id: string) => api.delete(`/ExpenseRequest/${id}`)
};
