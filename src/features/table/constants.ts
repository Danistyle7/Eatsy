import { TableCreate } from "./types";

export const TABLE_STATUSES = {
  AVAILABLE: {
    value: "available",
    label: "Disponible",
  },
  RESERVED: {
    value: "reserved",
    label: "Reservado",
  },
  UNAVAILABLE: {
    value: "unavailable",
    label: "No disponible",
  },
} as const;

export const defaultTable = {
  name: "",
  capacity: 0,
  status: TABLE_STATUSES.AVAILABLE.value,
} as const satisfies TableCreate;
