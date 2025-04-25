import * as SecureStore from "expo-secure-store";
import { PersistStorage, StorageValue } from "zustand/middleware";
import { PersistedAuthState, AuthState } from "./types";

export const authStorage: PersistStorage<PersistedAuthState> = {
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
