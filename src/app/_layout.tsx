import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Appearance, Platform } from "react-native";

import { useAuthStore } from "@/features/auth/store";
import { useFrameworkReady } from "@/shared/hooks";
import { queryClient } from "@/shared/lib/query-client";

export default function RootLayout() {
  useFrameworkReady();

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    const systemTheme = Appearance.getColorScheme();
    setColorScheme(systemTheme || "light");
    if (Platform.OS !== "web") useAuthStore.getState().initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
