import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { queryClient } from "@/shared/lib/query-client";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";
import { TableCreate } from "../types";

type Context = { previous?: TableCreate[] };

export const useCreateTable = () => {
  return useMutation<TableCreate, ApiError, TableCreate, Context>({
    mutationFn: async (data) => {
      const result = await tableService.create(data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newTable) => {
      await queryClient.cancelQueries({ queryKey: TABLE_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<TableCreate[]>(
        TABLE_QUERY_KEYS.lists()
      );
      queryClient.setQueryData(
        TABLE_QUERY_KEYS.lists(),
        (old: TableCreate[] = []) => [...old, { ...newTable, id: Date.now() }]
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(TABLE_QUERY_KEYS.lists(), context?.previous);
    },
    onSuccess: (newTable) => {
      queryClient.setQueryData(
        TABLE_QUERY_KEYS.lists(),
        (old: TableCreate[] = []) => [...old, newTable]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: TABLE_QUERY_KEYS.lists(),
        exact: false,
      });
    },
  });
};
