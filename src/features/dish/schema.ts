import { z } from "zod";

import { idSchema } from "@/shared/schemas";
import { imageUrlSchema } from "@/features/file/schemas";
import { DISH_CATEGORIES, DISH_TYPES } from "./constants";
import { DishCategoryValue, DishTypeValue } from "./types";

const categoryValues = Object.values(DISH_CATEGORIES).map((c) => c.value) as [
  DishCategoryValue,
];

export const dishCategorySchema = z.enum(categoryValues, {
  errorMap: (_) => ({
    message: `Categoría inválida. Opciones válidas: ${categoryValues.join(", ")}`,
  }),
});

const dishTypeValues = Object.values(DISH_TYPES).map((c) => c.value) as [
  DishTypeValue,
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
  // stock: z.number().int().nonnegative(),
  category: dishCategorySchema,
  imageUrl: imageUrlSchema.optional(), // Reutilizado desde shared/
  prepTime: z.number().int().positive(),
});

export const dishResponseSchema = dishCreateSchema.extend({
  id: idSchema,
  isAvailable: z.boolean(),
});

export const dishUpdateSchema = dishCreateSchema.partial();

export const dishParamsSchema = z.object({
  search: z.string().optional(),
  category: dishCategorySchema.optional(),
  type: dishTypeSchema.optional(),
  isAvailable: z.boolean().optional(),
  // page: z.number().int().positive().optional(),
  // limit: z.number().int().positive().max(100).optional(),
});
