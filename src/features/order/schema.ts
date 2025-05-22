import * as z from "zod";

import { idSchema } from "@/shared/schemas";

export const orderCreateSchema = z.object({
  customerId: idSchema,
  tableId: idSchema,
  items: z.array(
    z.object({
      dishId: idSchema,
      quantity: z.number(),
    })
  ),
});

export const orderResponseSchema = z.object({
  id_order: idSchema,
  items: z.array(
    z.object({
      id_table: idSchema,
      id_customer: idSchema,
      id_order: idSchema,
      id_order_item: idSchema,
      id_dish: idSchema,
      name_customer: z.string(),
      quantity: z.number(),
      status: z.string(),
      name_dish: z.string(),
      type: z.string(),
      description: z.string(),
      price: z.number(),
      isAvailable: z.boolean(),
      imageUrl: z.string(),
      prepTime: z.number(),
    })
  ),
});

// orderPanelSchema
export const orderPanelSchema = z.object({
  id_order: idSchema,
  id_order_item: idSchema,
  status: z.string(),
  quantity: z.number(),

  id_table: idSchema,
  number: z.number(),

  id_customer: idSchema,
  name_customer: z.string(),

  id_dish: idSchema,
  name_dish: z.string(),
  description: z.string(),
  price: z.number(),
  type: z.string(),
  isAvailable: z.boolean(),
  imageUrl: z.string(),
  prepTime: z.number(),
});

export const orderParamsSchema = z.object({
  // add more params here
});

export const orderUpdateSchema = z.object({
  status: z.string(),
});
