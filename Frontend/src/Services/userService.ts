import { api } from '../Api/api'; // seu axios configurado

export const userService = {
  createUser: (userData: any) => api.post('/User', userData),
  updateUser: (id: string, userData: any) => api.put(`/User/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/User/${id}`),
  getAllUsers: () => api.get('/User'),
  getUserById: (id: string) => api.get(`/User/${id}`)
};
