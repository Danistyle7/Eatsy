import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useFrameworkReady } from "@/shared/hooks/use-framework-ready";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";

useAuthStore.getState().initialize();

export default function RootLayout() {
  useFrameworkReady();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
