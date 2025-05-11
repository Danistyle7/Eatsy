import { TABLE_STATUSES } from "./constants";
import { TableStatus } from "./types";

export const getTableStatuses = () => {
  return Object.values(TABLE_STATUSES);
};

export const getTableStatus = (status: string): TableStatus => {
  const tableStatus = Object.values(TABLE_STATUSES).find(
    (s) => s.value === status
  );
  return tableStatus || TABLE_STATUSES.AVAILABLE;
};
