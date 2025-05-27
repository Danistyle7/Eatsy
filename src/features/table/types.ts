import { z } from "zod";
import {
  tableCreateSchema,
  tableParamsSchema,
  tableResponseSchema,
  scanTableResponseSchema,
  tableUpdateSchema,
} from "./schema";
import { TABLE_STATUSES } from "./constants";

export type TableStatus = (typeof TABLE_STATUSES)[keyof typeof TABLE_STATUSES];

export type TableCreate = z.infer<typeof tableCreateSchema>;
export type TableUpdate = z.infer<typeof tableUpdateSchema>;
export type TableResponse = z.infer<typeof tableResponseSchema>;
export type TableParams = z.infer<typeof tableParamsSchema>;
export type ScanTableResponse = z.infer<typeof scanTableResponseSchema>;
