import { z } from "zod";

/** Valida URLs de imágenes (con opcional placeholder) */
export const imageUrlSchema = z.string().url("URL inválida").or(z.literal("")); // Permite strings vacíos

export const imageUrlResponseSchema = z.string().url("URL inválida");
