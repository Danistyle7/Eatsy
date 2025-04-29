import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dishService } from "../service";
import { DISH_QUERY_KEYS } from "../constants";
import type { DishCreate, DishResponse } from "../types";
import { ApiError } from "@/shared/lib/api/errors";

type Context = { previous?: DishResponse[] };

export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation<DishResponse, Error, DishCreate, Context>({
    mutationFn: async (dish) => {
      const result = await dishService.create(dish);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"), {
          code: result.code,
        });
      return result.data;
    },
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey: DISH_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<DishResponse[]>(
        DISH_QUERY_KEYS.lists()
      );

      queryClient.setQueryData(
        DISH_QUERY_KEYS.lists(),
        (old: DishResponse[] = []) => [...old, { ...newDish, id: Date.now() }]
      );

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(DISH_QUERY_KEYS.lists(), context?.previous);
    },
    onSuccess: (newDish) => {
      queryClient.setQueryData(
        DISH_QUERY_KEYS.lists(),
        (old: DishResponse[] = []) => [...old, newDish]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DISH_QUERY_KEYS.lists() });
    },
  });
};
