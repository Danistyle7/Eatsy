import * as ExpoSecureStore from "expo-secure-store";
import { PersistStorage, StorageValue } from "zustand/middleware";
import { PersistedAuthState, AuthState } from "./types";

export const authStorage = {
  getItem: async (key: string) => {
    if (typeof ExpoSecureStore.getItemAsync === "function")
      return ExpoSecureStore.getItemAsync(key);
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (typeof ExpoSecureStore.setItemAsync === "function")
      await ExpoSecureStore.setItemAsync(key, value);
    else localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (typeof ExpoSecureStore.deleteItemAsync === "function")
      await ExpoSecureStore.deleteItemAsync(key);
    else localStorage.removeItem(key);
  },
};
