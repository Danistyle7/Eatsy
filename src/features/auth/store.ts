import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_TOKEN_KEY, AuthState } from "./types";
import { authStorage } from "./utils";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: true,
      initialize: async () => {
        try {
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, token: null });
        }
      },
      login: async (token) => {
        set({ token, isLoading: false });
      },
      logout: async () => {
        set({ token: null, isLoading: false });
      },
    }),
    {
      name: AUTH_TOKEN_KEY,
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        token: state.token,
        isLoading: state.isLoading,
      }),
    }
  )
);
