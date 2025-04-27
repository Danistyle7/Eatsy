import { z } from "zod";

// ========================
// 🏷️ Esquemas Básicos
// ========================

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
});
/** Valida URLs de imágenes (con opcional placeholder) */
export const imageUrlSchema = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal("")); // Permite strings vacíos

/** Valida emails (reutilizable en auth/user) */
export const emailSchema = z
  .string()
  .email("Email inválido")
  .max(100, "Máximo 100 caracteres");

/** Valida contraseñas (mínimo 8 caracteres, 1 mayúscula y 1 número) */
export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Requiere al menos 1 mayúscula")
  .regex(/[0-9]/, "Requiere al menos 1 número");

// ========================
// 📦 Esquemas Compuestos
// ========================

/** Valida fechas en formato ISO (YYYY-MM-DD) */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)");
/** Valida IDs numéricos positivos (para APIs) */
export const idSchema = z.number().int().positive();
/** Valida opciones de selección (ej: dropdowns) */
export const selectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type SelectOption = z.infer<typeof selectOptionSchema>;

// ========================
// 🛠️ Funciones Útiles
// ========================

/**
 * Transforma un string vacío (`""`) en `undefined`. Ideal para:
 * - Limpiar valores de formularios antes de enviarlos a una API.
 * - Manejar campos opcionales en actualizaciones parciales (PATCH).
 *
 * @example
 * ```ts
 * const schema = z.object({ notes: emptyStringToUndefined });
 * schema.parse({ notes: "" }); // { notes: undefined }
 * ```
 *
 * @remarks
 * Diferenciación clara entre:
 * - `""` → `undefined` (campo no proporcionado)
 * - `null` → Valor explícitamente borrado (depende de la API)
 */
export const emptyStringToUndefined = z.literal("").transform(() => undefined);

/**
 * Crea un campo de string opcional que aplica validaciones personalizadas si el valor existe.
 * Combina `emptyStringToUndefined` con un esquema Zod para validación condicional.
 *
 * @param schema - Esquema Zod que valida el string cuando no está vacío.
 *
 * @example
 * ```ts
 * // Campo opcional que debe ser URL válida si existe:
 * const schema = z.object({
 *   website: optionalString(z.string().url())
 * });
 *
 * schema.parse({ website: "" });      // { website: undefined }
 * schema.parse({ website: "hola" });  // ¡Error! URL inválida
 * ```
 *
 * @remarks
 * Usar cuando:
 * 1. El campo es opcional, pero debe cumplir reglas si el usuario ingresa algo.
 * 2. Se necesita reutilizar validaciones complejas (ej: emails, códigos).
 */
export const optionalString = (schema: z.ZodType<string>) =>
  z.union([emptyStringToUndefined, schema]);
