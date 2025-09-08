import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Isso faz o cookie ir JUNTO


});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

