import { z } from "zod";

export const apiResponseSchema = z.union([
  z.object({ success: z.literal(true), data: z.unknown() }),
  z.object({ success: z.literal(false), message: z.string() }),
]);
