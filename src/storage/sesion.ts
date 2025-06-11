// storage/useUserSession.ts
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getUserSession } from "./user-session";

// Hook genérico que carga toda la sesión del usuario
export function useUserSession() {
  const [session, setSession] = useState<{
    tableCode: string | null;
    tableId: string | null;
    userId: string | null;
    userName: string | null;
  }>({
    tableCode: null,
    tableId: null,
    userId: null,
    userName: null,
  });

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const data = await getUserSession();
        setSession({
          tableCode: data?.tableCode ?? null,
          tableId: data?.tableId ?? null,
          userId: data?.userId ?? null,
          userName: data?.userName ?? null,
        });
      };
      fetch();
    }, [])
  );

  return session;
}
