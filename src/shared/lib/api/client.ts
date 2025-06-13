import axios, { isAxiosError } from "axios";

import { useAuthStore } from "@/features/auth/store";
import { ApiError } from "./errors";

const apiClient = axios.create({
  baseURL: "https://eatzybe-production.up.railway.app/",
  timeout: 30_000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "es-ES",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof config.url !== "string") throw new Error("URL must be a string");
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData)
    config.headers["Content-Type"] = "multipart/form-data";
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(
        new ApiError("Non-Axios error", 500, {
          code: "UNKNOWN_ERROR",
          details: error,
        })
      );
    }

    const originalRequest = error.config as { _retry?: boolean };
    const { logout, token } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      try {
        // await refreshToken();  // 🚨 TODO: Implementar refreshToken
        return apiClient(originalRequest);
      } catch (refreshError) {
        await logout();
      }
    }

    const apiError =
      error.response?.data?.message || error.message || "Error desconocido";
    // error.message = REQUEST_ERROR_CODES[error.code || ""] || error.message;

    return Promise.reject(
      new ApiError(apiError, error.response?.status || 500, {
        code: error.code,
        details: error.response?.data,
      })
    );
  }
);

export default apiClient;
