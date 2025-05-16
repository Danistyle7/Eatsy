import { TableCreate, TableParams, TableResponse } from "./types";

export const TABLE_QUERY_KEYS = {
  all: ["tables"],
  lists: (params?: TableParams) => [...TABLE_QUERY_KEYS.all, "list", params],
  details: () => [...TABLE_QUERY_KEYS.all, "detail"],
  detail: (id: TableResponse["id"]) => [...TABLE_QUERY_KEYS.details(), id],
  scan: (qrCode: TableResponse["qrCode"]) => [
    ...TABLE_QUERY_KEYS.all,
    "scan",
    qrCode,
  ],
};

export const TABLE_STATUSES = {
  AVAILABLE: { value: "AVAILABLE", label: "Disponible", icon: "🟢" },
  OCCUPIED: { value: "OCCUPIED", label: "Ocupado", icon: "🔴" },
  RESERVED: { value: "RESERVED", label: "Reservado", icon: "🟡" },
  MAINTENANCE: { value: "MAINTENANCE", label: "No disponible", icon: "🛠️" },
  DELETED: { value: "DELETED", label: "Eliminado", icon: "🗑️" },
} as const;

export const defaultTable = {
  number: 0,
  capacity: 0,
  status: TABLE_STATUSES.AVAILABLE.value,
} as const satisfies TableCreate;
