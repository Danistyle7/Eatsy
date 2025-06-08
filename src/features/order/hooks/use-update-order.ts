import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderResponse as Order, OrderUpdate } from "../types";

type MutationVariables = { id: Order["id_order"]; data: OrderUpdate };
type Context = { previous?: Order };

export const useUpdateOrderById = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, ApiError, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await orderService.update(id, data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      const queryKey = ORDER_QUERY_KEYS.detail(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Order>(queryKey);

      queryClient.setQueryData(queryKey, (old?: Order) =>
        old ? { ...old, ...data } : undefined
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
