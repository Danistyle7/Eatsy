import { z } from "zod";
import {
  dishCreateSchema,
  dishUpdateSchema,
  dishResponseSchema,
  dishParamsSchema,
} from "./schema";

export type DishCreate = z.infer<typeof dishCreateSchema>;
export type DishUpdate = z.infer<typeof dishUpdateSchema>;
export type DishResponse = z.infer<typeof dishResponseSchema>;
export type DishParams = z.infer<typeof dishParamsSchema>;
