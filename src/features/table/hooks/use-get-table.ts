import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";

import type { TableParams, TableResponse, ScanTableResponse } from "../types";

export const useGetAllTables = (params?: TableParams) => {
  return useQuery<TableResponse[], ApiError>({
    queryKey: TABLE_QUERY_KEYS.lists(params),
    queryFn: async () => {
      const result = await tableService.getAll(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
  });
};

export const useGetTableById = (id: TableResponse["id"]) => {
  return useQuery<TableResponse, ApiError>({
    queryKey: TABLE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const result = await tableService.getById(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: !!id,
  });
};

export const useGetTableByQrCode = (
  qrCode: TableResponse["qrCode"],
  nameCustomer: string
) => {
  return useQuery<ScanTableResponse, ApiError>({
    queryKey: TABLE_QUERY_KEYS.scan(qrCode, nameCustomer),
    queryFn: async () => {
      const result = await tableService.scan(qrCode, nameCustomer);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: false,
  });
};
