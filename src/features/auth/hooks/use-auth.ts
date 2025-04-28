import { useAuthStore } from "../store";

/**
 * Hook para acceder al estado de autenticación en Componentes.
 * @returns Tupla con estado y acciones
 */
export const useAuth = () => {
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const actions = useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    initialize: state.initialize,
  }));

  return [{ token, isLoading }, actions] as const;
};
