import { z } from "zod";

import {
  orderCreateSchema,
  orderPanelSchema,
  orderParamsSchema,
  orderResponseSchema,
  orderUpdateSchema,
} from "./schema";

export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;
export type OrderParams = z.infer<typeof orderParamsSchema>;
export type OrderPanel = z.infer<typeof orderPanelSchema>;
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
