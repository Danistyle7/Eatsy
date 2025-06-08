import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderResponse as Order, OrderCreate } from "../types";

type Context = { previous?: Order[] };

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const queryKey = ORDER_QUERY_KEYS.lists();
  return useMutation<Order, ApiError, OrderCreate, Context>({
    mutationFn: async (dish) => {
      const result = await orderService.create(dish);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Order[]>(queryKey);

      // Fake data for the new dish
      const now = Date.now();
      const id = now.valueOf();

      // TODO: This is a temporary solution to generate an ID for the new order.
      // In a real application, the backend should return the ID of the created order.
      queryClient.setQueryData(queryKey, (old: Order[] = []) => [
        ...old,
        { ...newDish, id_order: id },
      ]);

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSuccess: (newDish) => {
      queryClient.setQueryData(queryKey, (old: Order[] = []) => [
        ...old,
        newDish,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false });
    },
  });
};
