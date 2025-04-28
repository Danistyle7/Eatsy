import axios, { isAxiosError } from "axios";

import { useAuthStore } from "@/features/auth/store";
import { apiResponseSchema } from "@/shared/schemas";

const apiClient = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8001",
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
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const result = apiResponseSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error(
        `Estructura inválida: ${result.error.errors
          .map((e) => `${e.path.join(".")} (${e.message})`)
          .join(", ")}`
      );
    }

    if (!result.data.success)
      throw new Error(result.data.message || "Error desconocido");

    return { ...response, data: result.data.data };
  },
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      console.error("Non-Axios error:", error);
      return Promise.reject(error);
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

    return Promise.reject(new Error(`[${error.response?.status}] ${apiError}`));
  }
);

export default apiClient;
