import { z } from "zod";
import { tableCreateSchema } from "./schema";
import { TABLE_STATUSES } from "./constants";

export type TableStatusValue =
  (typeof TABLE_STATUSES)[keyof typeof TABLE_STATUSES]["value"];

export type TableStatus = (typeof TABLE_STATUSES)[keyof typeof TABLE_STATUSES];

export type TableCreate = z.infer<typeof tableCreateSchema>;
