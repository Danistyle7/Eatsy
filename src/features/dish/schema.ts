import { z } from "zod";

import { idSchema, imageUrlSchema } from "@/shared/schemas";
import { DISH_CATEGORIES } from "./constants";

const categoryValues = Object.values(DISH_CATEGORIES).map((c) => c.value) as [
  string,
  ...string[],
];

export const dishCategorySchema = z.enum(categoryValues, {
  errorMap: (_) => ({
    message: `Categoría inválida. Opciones válidas: ${categoryValues.join(", ")}`,
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
  category: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});
