// storage/hooks.ts
import { useUserSession } from "./sesion";

export function useTableCode() {
  const { tableCode } = useUserSession();
  return tableCode;
}

export function useTableId() {
  const { tableId } = useUserSession();
  return tableId;
}

export function useUserId() {
  const { userId } = useUserSession();
  return userId;
}

export function useUserName() {
  const { userName } = useUserSession();
  return userName;
}
