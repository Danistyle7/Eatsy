import { z } from "zod";
import { TableStatusValue } from "./types";
import { TABLE_STATUSES } from "./constants";

const tableStatusValues = Object.values(TABLE_STATUSES).map((c) => c.value) as [
  TableStatusValue,
];

export const tableStatusSchema = z.enum(tableStatusValues, {
  errorMap: (_) => ({
    message: `Tipo de plato inválido. Opciones válidas: ${tableStatusValues.join(
      ", "
    )}`,
  }),
});

export const tableCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(150),
  capacity: z.number().int().positive().max(100),
  status: tableStatusSchema,
});
