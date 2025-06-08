import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";

import type {
  TableParams,
  TableResponse as Table,
  ScanTableResponse as ScanTable,
} from "../types";

export const useGetTables = (params?: TableParams) => {
  const queryClient = useQueryClient();
  const queryKey = TABLE_QUERY_KEYS.lists(params);
  const query = useQuery<Table[], ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await tableService.getAll(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
  });
  const setTables = (
    updater: Table[] | ((oldData: Table[] | undefined) => Table[])
  ) => {
    queryClient.setQueryData(queryKey, updater);
  };
  return { tables: query.data ?? [], setTables, ...query };
};

export const useGetTableById = (id: Table["id"]) => {
  const queryClient = useQueryClient();
  const queryKey = TABLE_QUERY_KEYS.detail(id);
  const query = useQuery<Table, ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await tableService.getById(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: !!id,
  });
  const setTable = (
    updater: Table | ((oldData: Table | undefined) => Table)
  ) => {
    queryClient.setQueryData(queryKey, updater);
  };
  return { table: query.data || null, setTable, ...query };
};

export const useGetTableByQrCode = (
  qrCode: Table["qrCode"],
  nameCustomer: string
) => {
  const queryClient = useQueryClient();
  const queryKey = TABLE_QUERY_KEYS.scan(qrCode, nameCustomer);
  const query = useQuery<ScanTable, ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await tableService.scan(qrCode, nameCustomer);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: false,
  });
  const setTable = (
    updater: ScanTable | ((oldData: ScanTable | undefined) => ScanTable)
  ) => {
    queryClient.setQueryData(queryKey, updater);
  };
  return { table: query.data || null, setTable, ...query };
};
