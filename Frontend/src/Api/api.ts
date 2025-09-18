import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Isso faz o cookie ir JUNTO


});

