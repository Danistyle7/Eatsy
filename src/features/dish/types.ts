import { z } from "zod";
import {
  dishCreateSchema,
  dishUpdateSchema,
  dishResponseSchema,
  dishParamsSchema,
} from "./schema";
import { DISH_CATEGORIES } from "./constants";

export type DishCreate = z.infer<typeof dishCreateSchema>;
export type DishUpdate = z.infer<typeof dishUpdateSchema>;
export type DishResponse = z.infer<typeof dishResponseSchema>;
export type DishParams = z.infer<typeof dishParamsSchema>;

export type DishCategoryValue =
  (typeof DISH_CATEGORIES)[keyof typeof DISH_CATEGORIES]["value"];
export type DishCategory =
  (typeof DISH_CATEGORIES)[keyof typeof DISH_CATEGORIES];
