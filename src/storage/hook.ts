import { useEffect, useState } from "react";
import { getUserSession } from "./user-session";
export function useTableCode() {
  const [tableCode, setTableCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTableCode() {
      const session = await getUserSession();
      if (session?.tableCode) setTableCode(session.tableCode);
    }
    fetchTableCode();
  }, []);

  return tableCode;
}

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUserSession().then((session) => {
      if (session?.userId) setUserId(session.userId);
    });
  }, []);

  return userId;
}
export function useUserName(): string | null {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    getUserSession().then((session) => {
      if (session?.userName) setUserName(session.userName);
    });
  }, []);

  return userName;
}
export function useTableId(): string | null {
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    getUserSession().then((session) => {
      if (session?.tableId) setTableId(session.tableId);
    });
  }, []);

  return tableId;
}
