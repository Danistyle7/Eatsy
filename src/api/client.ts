import axios from "axios";

import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: "http://localhost:8001",
});

api.interceptors.request.use(async (config) => {
  try {
    const { token } = useAuthStore.getState();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Error en interceptor:", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) await useAuthStore.getState().logout();
    return Promise.reject(error);
  }
);

export default api;
