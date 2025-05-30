import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { DISH_QUERY_KEYS } from "../constants";
import { dishService } from "../service";
import type { DishResponse as Dish } from "../types";

type Context = { previous?: Dish[] };

export const useDeleteDishById = () => {
  const queryClient = useQueryClient();
  const queryKey = DISH_QUERY_KEYS.lists();
  return useMutation<void, ApiError, Dish["id"], Context>({
    mutationFn: async (id) => {
      const result = await dishService.delete(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Dish[]>(queryKey);

      queryClient.setQueryData(queryKey, (old: Dish[] = []): Dish[] =>
        old.filter((dish) => dish.id !== id)
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
