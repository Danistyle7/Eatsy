import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";
import type { TableCreate, TableResponse as Table } from "../types";

type Context = { previous?: Table[] };

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  const queryKey = TABLE_QUERY_KEYS.lists();
  return useMutation<Table, ApiError, TableCreate, Context>({
    mutationFn: async (table) => {
      const result = await tableService.create(table);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newTable) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Table[]>(queryKey);

      // Fake data for the new table
      const now = Date.now();
      const id = now.valueOf();
      const qrCode = newTable.number.toString();
      const qrCodeUrl = "www.google.com";

      queryClient.setQueryData(queryKey, (old: Table[] = []): Table[] => [
        ...old,
        { ...newTable, id, qrCode, qrCodeUrl }, // Simulate a new table with a unique ID and QR code
      ]);
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSuccess: (newTable) => {
      queryClient.setQueryData(queryKey, (old: Table[] = []): Table[] => [
        ...old,
        newTable,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false });
    },
  });
};
