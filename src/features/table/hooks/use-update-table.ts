import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { TABLE_QUERY_KEYS } from "../constants";
import { tableService } from "../service";
import type { TableResponse as Table, TableUpdate } from "../types";

type MutationVariables = { id: Table["id"]; data: TableUpdate };
type Context = { previous?: Table };

export const useUpdateTableById = () => {
  const queryClient = useQueryClient();
  return useMutation<Table, ApiError, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await tableService.update(id, data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      const queryKey = TABLE_QUERY_KEYS.detail(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Table>(queryKey);

      queryClient.setQueryData(TABLE_QUERY_KEYS.detail(id), (old?: Table) =>
        old ? { ...old, ...data } : undefined
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

export const usePayTable = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, Table["id"], Context>({
    mutationFn: async (id) => {
      const result = await tableService.pay(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async (id) => {
      const queryKey = TABLE_QUERY_KEYS.detail(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Table>(queryKey);

      queryClient.setQueryData(TABLE_QUERY_KEYS.detail(id), (old?: Table) =>
        old ? { ...old, status: "PAID" } : undefined
      );

      return { previous };
    },
    onError: (_, id, context) => {
      queryClient.setQueryData(TABLE_QUERY_KEYS.detail(id), context?.previous);
    },
    onSettled: (data, _, id) => {
      queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.detail(id) });
      if (data)
        queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEYS.lists() });
    },
  });
};
