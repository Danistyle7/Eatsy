import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de datos "frescos"
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response?.status === 401) return false;
        return failureCount < 2;
      },
      networkMode: "offlineFirst", // Prioriza caché cuando hay problemas de red
    },
    mutations: { retry: false }, // Desactivado (manejar manualmente)
  },
});
