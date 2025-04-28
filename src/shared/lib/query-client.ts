import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de datos "frescos"
      retry: (failureCount, error) => {
        if (isAxiosError(error)) {
          const ignoredStatuses = [400, 401, 403, 404];
          return (
            !ignoredStatuses.includes(error.status || 0) && failureCount < 2
          );
        }
        return failureCount < 2;
      },
      networkMode: "offlineFirst", // Prioriza caché cuando hay problemas de red
    },
    mutations: { retry: false }, // Desactivado (manejar manualmente)
  },
});
