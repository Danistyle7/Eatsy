import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  userId: "id_usuario",
  userName: "nombre_usuario",
  tableId: "id_mesa",
  tableCode: "codigo_mesa",
} as const;

type UserSession = {
  userId: string | null;
  userName: string | null;
  tableId: string | null;
  tableCode: string | null;
};

export const saveUserSession = async ({
  userId,
  userName,
  tableId,
  tableCode,
}: UserSession): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [KEYS.userId, userId ?? ""],
      [KEYS.userName, userName ?? ""],
      [KEYS.tableId, tableId ?? ""],
      [KEYS.tableCode, tableCode ?? ""],
    ]);
  } catch (e) {
    console.error("Error guardando sesión:", e);
  }
};

export const getUserSession = async (): Promise<UserSession | null> => {
  try {
    const values = await AsyncStorage.multiGet([
      KEYS.userId,
      KEYS.userName,
      KEYS.tableId,
      KEYS.tableCode,
    ]);

    // multiGet returns an array of [key, value | null]
    const session: UserSession = {
      userId: values[0][1],
      userName: values[1][1],
      tableId: values[2][1],
      tableCode: values[3][1],
    };

    return session;
  } catch (e) {
    console.error("Error obteniendo sesión:", e);
    return null;
  }
};

export const clearUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.userId,
      KEYS.userName,
      KEYS.tableId,
      KEYS.tableCode,
    ]);
  } catch (e) {
    console.error("Error limpiando sesión:", e);
  }
};
