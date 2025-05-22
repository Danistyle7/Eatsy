import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { queryClient } from "@/shared/lib/query-client";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderResponse, OrderUpdate } from "../types";

type MutationVariables = { id: OrderResponse["id_order"]; data: OrderUpdate };
type Context = { previous?: OrderResponse };

export const useUpdateOrderById = () => {
  return useMutation<OrderResponse, ApiError, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await orderService.update(id, data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: ORDER_QUERY_KEYS.detail(id),
      });
      const previous = queryClient.getQueryData<OrderResponse>(
        ORDER_QUERY_KEYS.detail(id)
      );

      queryClient.setQueryData(
        ORDER_QUERY_KEYS.detail(id),
        (old?: OrderResponse) => (old ? { ...old, ...data } : undefined)
      );

      return { previous };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(id), context?.previous);
    },
    onSettled: (data, _, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(id) });
      if (data)
        queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() });
    },
  });
};
