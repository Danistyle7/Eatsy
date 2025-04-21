import * as SecureStore from "expo-secure-store";
import { create, StateCreator } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";

import { AUTH_TOKEN_KEY, AuthState, PersistedAuthState } from "@/types/auth";

const secureStorage: PersistStorage<PersistedAuthState> = {
  getItem: async (name): Promise<StorageValue<AuthState> | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value ? { state: JSON.parse(value) } : null;
    } catch (error) {
      return null;
    }
  },
  setItem: async (name, value): Promise<void> => {
    await SecureStore.setItemAsync(name, JSON.stringify(value.state));
  },
  removeItem: async (name): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

const __authStoreMiddleware = (
  initializer: StateCreator<AuthState, [["zustand/persist", unknown]], []>
) =>
  persist(initializer, {
    name: AUTH_TOKEN_KEY,
    storage: secureStorage,
    partialize: (state) => ({
      token: state.token,
      isLoading: state.isLoading,
    }),
  });

/**
 * Store de autenticación con persistencia segura.
 *
 * REGLAS DE USO:
 *
 * - ✅ USAR `useAuthStore(selector)` en componentes para valores que deben causar rerender.
 * - ✅ USAR `useAuthStore.getState()` en handlers/effects para acceder al estado actual sin suscripción.
 * - ✅ USAR selectores específicos (`state.token`) en lugar de destructurar todo el estado.
 * - 🚨 EVITAR destructurar directamente: `const { token } = useAuthStore()` (puede causar rerenders innecesarios).
 * - 🔄 Para múltiples valores, usar `shallow` para evitar reescribir el estado.
 *
 * Ejemplos de uso:
 *
 * 1. Obtener el token (con rerender automático cuando cambie):
 * @example
 * const token = useAuthStore((state) => state.token);
 *
 * 2. Acceder al token SIN rerender (en handlers/effects):
 * @example
 * const { token } = useAuthStore.getState();
 *
 * 3. Login (actualiza estado y SecureStore automáticamente):
 * @example
 * const handleLogin = async () => {
 *   try {
 *     const apiToken = await loginAPI(email, password);
 *     useAuthStore.getState().login(apiToken);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 *
 * 4. Logout (limpia estado y SecureStore):
 * @example
 * <Button
 *   onPress={() => useAuthStore.getState().logout()}
 *   title="Cerrar sesión"
 * />
 *
 * 5. Acceder a múltiples valores con rerender optimizado:
 * @example
 * import { shallow } from 'zustand/shallow';
 * const { token, isLoading } = useAuthStore(
 *   (state) => ({ token: state.token, isLoading: state.isLoading }),
 *   shallow
 * );
 *
 * 6. Uso en interceptors API (fuera de componentes):
 * @example
 * api.interceptors.request.use((config) => {
 *   const { token } = useAuthStore.getState();
 *   if (token) config.headers.Authorization = `Bearer ${token}`;
 *   return config;
 * });
 */
export const useAuthStore = create<AuthState>()(
  __authStoreMiddleware((set) => ({
    token: null,
    isLoading: true,
    initialize: async () => {
      try {
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false, token: null });
      }
    },
    login: async (token: string) => {
      set({ token, isLoading: false });
    },
    logout: async () => {
      set({ token: null, isLoading: false });
    },
  }))
);
