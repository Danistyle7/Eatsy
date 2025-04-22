import { z } from "zod";
import { imageUrlSchema } from "./shared/base";

export const dishCreateSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(150),
  description: z.string().max(500).optional(),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1),
  imageUrl: imageUrlSchema.optional(), // Reutilizado desde shared/
  prepTime: z.number().int().positive(),
});

export const dishResponseSchema = dishCreateSchema.extend({
  id: z.number().int(),
  isAvailable: z.boolean().default(true),
});

export const dishUpdateSchema = dishCreateSchema.partial();

export const dishParamsSchema = z.object({
  category: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type DishCreate = z.infer<typeof dishCreateSchema>;
export type DishUpdate = z.infer<typeof dishUpdateSchema>;
export type DishResponse = z.infer<typeof dishResponseSchema>;
export type DishParams = z.infer<typeof dishParamsSchema>;
