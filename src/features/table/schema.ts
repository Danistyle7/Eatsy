import { z } from "zod";

import { idSchema } from "@/shared/schemas";
import { TABLE_STATUSES } from "./constants";
import { TableStatus } from "./types";

const tableStatusValues = Object.values(TABLE_STATUSES).map((c) => c.value) as [
  TableStatus["value"],
];

export const tableStatusSchema = z.enum(tableStatusValues, {
  errorMap: (_) => ({
    message: `Tipo de plato inválido. Opciones válidas: ${tableStatusValues.join(
      ", "
    )}`,
  }),
});

export const tableCreateSchema = z.object({
  number: z.number().int().positive(),
  capacity: z.number().int().positive(),
  status: tableStatusSchema,
});

export const tableUpdateSchema = tableCreateSchema.partial();

export const tableResponseSchema = tableCreateSchema.extend({
  id: idSchema,
  qrCode: z.string(),
  // qrCodeUrl: z.string(),
});

export const tableParamsSchema = z.object({
  status: tableStatusSchema.optional(),
});
