import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { DISH_QUERY_KEYS } from "../constants";
import { dishService } from "../service";
import type { DishCreate, DishResponse as Dish } from "../types";

type Context = { previous?: Dish[] };

export const useCreateDish = () => {
  const queryClient = useQueryClient();
  const queryKey = DISH_QUERY_KEYS.lists();
  return useMutation<Dish, ApiError, DishCreate, Context>({
    mutationFn: async (dish) => {
      const result = await dishService.create(dish);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Dish[]>(queryKey);

      // Fake data for the new dish
      const now = Date.now();
      const id = now.valueOf();

      queryClient.setQueryData(queryKey, (old: Dish[] = []): Dish[] => [
        ...old,
        { ...newDish, id },
      ]);

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSuccess: (newDish) => {
      queryClient.setQueryData(queryKey, (old: Dish[] = []): Dish[] => [
        ...old,
        newDish,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false });
    },
  });
};
