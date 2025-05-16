import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { queryClient } from "@/shared/lib/query-client";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";
import type { TableResponse, TableUpdate } from "../types";

type MutationVariables = { id: TableResponse["id"]; data: TableUpdate };
type Context = { previous?: TableResponse };

export const useUpdateTableById = () => {
  return useMutation<TableResponse, ApiError, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await tableService.update(id, data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: TABLE_QUERY_KEYS.detail(id),
      });
      const previous = queryClient.getQueryData<TableResponse>(
        TABLE_QUERY_KEYS.detail(id)
      );

      queryClient.setQueryData(
        TABLE_QUERY_KEYS.detail(id),
        (old?: TableResponse) => (old ? { ...old, ...data } : undefined)
      );

      return { previous };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(TABLE_QUERY_KEYS.detail(id), context?.previous);
    },
    onSettled: (data, _, { id }) => {
      queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.detail(id) });
      if (data)
        queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.lists() });
    },
  });
};
