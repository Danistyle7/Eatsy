import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { DISH_QUERY_KEYS } from "../constants";
import { dishService } from "../service";
import type { DishParams, DishResponse as Dish } from "../types";

export const useGetDishes = (params?: DishParams) => {
  const queryClient = useQueryClient();
  const queryKey = DISH_QUERY_KEYS.lists(params);
  const query = useQuery<Dish[], ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await dishService.getAll(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
  });

  const setDishes = (
    updater: Dish[] | ((oldData: Dish[] | undefined) => Dish[])
  ) => {
    queryClient.setQueryData<Dish[]>(queryKey, updater);
  };
  return { dishes: query.data || [], setDishes, ...query };
};

export const useGetDishById = (id: Dish["id"]) => {
  const queryClient = useQueryClient();
  const queryKey = DISH_QUERY_KEYS.detail(id);
  const query = useQuery<Dish, ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await dishService.getById(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: !!id,
  });
  const setDish = (updater: Dish | ((oldData: Dish | undefined) => Dish)) => {
    queryClient.setQueryData<Dish>(queryKey, updater);
  };
  return { dish: query.data || null, setDish, ...query };
};
