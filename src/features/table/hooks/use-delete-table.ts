import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { queryClient } from "@/shared/lib/query-client";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";
import type { TableResponse as Table } from "../types";

type Context = { previous?: Table[] };

export const useDeleteTableById = () => {
  const queryClient = useQueryClient();
  const queryKey = TABLE_QUERY_KEYS.lists();
  return useMutation<void, ApiError, Table["id"], Context>({
    mutationFn: async (id) => {
      const result = await tableService.delete(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Table[]>(queryKey);

      queryClient.setQueryData(queryKey, (old: Table[] = []): Table[] =>
        old.filter((table) => table.id !== id)
      );

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false });
    },
  });
};
