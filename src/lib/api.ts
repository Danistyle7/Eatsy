import axios, { isAxiosError } from "axios";
import { z } from "zod";

import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8001",
  timeout: 30_000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "es-ES",
  },
});

api.interceptors.request.use((config) => {
  if (typeof config.url !== "string") throw new Error("URL must be a string");
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const schema = z.union([
      z.object({ success: z.literal(true), data: z.unknown() }),
      z.object({ success: z.literal(false), message: z.string() }),
    ]);
    const result = schema.safeParse(response.data);

    if (!result.success) throw new Error("Estructura de respuesta inválida");
    if (!result.data.success)
      throw new Error(result.data.message || "Error desconocido");

    return { ...response, data: result.data.data };
  },
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      console.error("Non-Axios error:", error);
      return Promise.reject(error);
    }

    const config = error.config as { _retry?: boolean };
    const { logout, token } = useAuthStore.getState();

    if (error.response?.status === 401 && !config._retry && token) {
      config._retry = true;
      try {
        // await refreshToken();  // 🚨 TODO: Implementar refreshToken
        return api(config);
      } catch (refreshError) {
        await logout();
      }
    }

    // error.message = REQUEST_ERROR_CODES[error.code || ""] || error.message;
    return Promise.reject(error);
  }
);

export default api;
