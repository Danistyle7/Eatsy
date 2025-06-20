import { z } from "zod";

import { imageUrlSchema } from "@/features/file/schemas";
import { idSchema } from "@/shared/schemas";
import { DISH_CATEGORIES, DISH_TYPES } from "./constants";
import { DishCategory, DishType } from "./types";

const dishCategoryValues = Object.values(DISH_CATEGORIES).map(
  (c) => c.value
) as [DishCategory["value"]];

export const dishCategorySchema = z.enum(dishCategoryValues, {
  errorMap: (_) => ({
    message: `Categoría inválida. Opciones válidas: ${dishCategoryValues.join(", ")}`,
  }),
});

const dishTypeValues = Object.values(DISH_TYPES).map((c) => c.value) as [
  DishType["value"],
];

export const dishTypeSchema = z.enum(dishTypeValues, {
  errorMap: (_) => ({
    message: `Tipo de plato inválido. Opciones válidas: ${dishTypeValues.join(
      ", "
    )}`,
  }),
});

export const dishCreateSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(150),
  description: z.string().max(500).optional(),
  price: z.number().positive("El precio debe ser positivo"),
  category: dishCategorySchema,
  type: dishTypeSchema,
  isAvailable: z.boolean(),
  imageUrl: imageUrlSchema,
  prepTime: z.number().int().positive(),
});

export const dishUpdateSchema = dishCreateSchema.partial();

export const dishResponseSchema = dishCreateSchema.extend({
  id: idSchema,
});

export const dishParamsSchema = z.object({
  search: z.string().optional(),
  category: dishCategorySchema.optional(),
  type: dishTypeSchema.optional(),
  isAvailable: z.boolean().optional(),
  // page: z.number().int().positive().optional(),
  // limit: z.number().int().positive().max(100).optional(),
});
