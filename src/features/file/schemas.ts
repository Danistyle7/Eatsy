import { z } from "zod";

/** Valida URLs de imágenes (con opcional placeholder) */
export const imageUrlSchema = z.string().url("URL inválida");

export const imageUrlResponseSchema = z.string().url("URL inválida");
