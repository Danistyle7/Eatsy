import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dishService } from "../api";
import { DISH_QUERY_KEYS } from "../constants";
import type { DishResponse } from "../types";

type Context = { previous?: DishResponse[] };

export const useDeleteDishById = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DishResponse["id"], Context>({
    mutationFn: async (id) => {
      const result = await dishService.delete(id);
      if (!result.success) throw new Error(result.error);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: DISH_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<DishResponse[]>(
        DISH_QUERY_KEYS.lists()
      );

      queryClient.setQueryData(
        DISH_QUERY_KEYS.lists(),
        (old: DishResponse[] = []) => old.filter((dish) => dish.id !== id)
      );

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(DISH_QUERY_KEYS.lists(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DISH_QUERY_KEYS.lists() });
    },
  });
};
