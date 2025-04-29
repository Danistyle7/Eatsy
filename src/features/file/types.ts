import { z } from "zod";
import { imageUrlResponseSchema, imageUrlSchema } from "./schemas";

export type ImageUploadResponse = z.infer<typeof imageUrlResponseSchema>;
export type ImageUpload = z.infer<typeof imageUrlSchema>;
