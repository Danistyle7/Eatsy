import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { queryClient } from "@/shared/lib/query-client";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderCreate, OrderResponse } from "../types";

type Context = { previous?: OrderResponse[] };

export const useCreateOrder = () => {
  return useMutation<OrderResponse, ApiError, OrderCreate, Context>({
    mutationFn: async (dish) => {
      const result = await orderService.create(dish);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey: ORDER_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<OrderResponse[]>(
        ORDER_QUERY_KEYS.lists()
      );

      queryClient.setQueryData(
        ORDER_QUERY_KEYS.lists(),
        (old: OrderResponse[] = []) => [...old, { ...newDish, id: Date.now() }]
      );

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.lists(), context?.previous);
    },
    onSuccess: (newDish) => {
      queryClient.setQueryData(
        ORDER_QUERY_KEYS.lists(),
        (old: OrderResponse[] = []) => [...old, newDish]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.lists(),
        exact: false,
      });
    },
  });
};
