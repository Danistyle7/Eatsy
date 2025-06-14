import { DISH_CATEGORIES, DISH_TYPES } from "./constants";
import { DishCategory, DishType } from "./types";

/**
 * Obtiene la metadata completa de una categoría por su valor
 * @param value - Valor de la categoría (ej: "appetizer")
 * @returns Objeto con label, icon, etc.
 */
export const getDishCategory = (value: string): DishCategory => {
  const category = Object.values(DISH_CATEGORIES).find(
    (c) => c.value === value
  );
  return category ?? DISH_CATEGORIES.OTHER;
};

/**
 * Genera opciones para componentes UI
 * @returns Array de opciones { label, value, icon }
 */
export const getDishCategories = () => {
  return Object.values(DISH_CATEGORIES);
};

/**
 * Traduce las categorías usando la función de traducción `t`
 * @param t - Función de traducción (ej: i18n.t)
 * @returns Array de categorías traducidas
 */
export const getTranslatedCategories = (
  t: (key: string, params?: Record<string, unknown>) => string
) => {
  return Object.values(DISH_CATEGORIES).map((cat) => ({
    ...cat,
    label: t(`dish.categories.${cat.value}.label`),
    tooltip: t(`dish.categories.${cat.value}.tooltip`), // Ejemplo de extensión
  }));
};

/**
 * Obtiene la metadata completa de una tipo de plato por su valor
 * @param value - Valor de la tipo de plato (ej: "FOOD")
 * @returns Objeto con label, icon, etc.
 */
export const getDishType = (value: string): DishType => {
  const type = Object.values(DISH_TYPES).find((t) => t.value === value);
  return type ?? DISH_TYPES.FOOD;
};

/**
 * Genera opciones para componentes UI
 * @returns Array de opciones { label, value, icon }
 */
export const getDishTypes = () => {
  return Object.values(DISH_TYPES);
};

/**
 * Traduce las tipos de plato usando la función de traducción `t`
 * @param t - Función de traducción (ej: i18n.t)
 * @returns Array de tipos de plato traducidos
 */
export const getTranslatedTypes = (
  t: (key: string, params?: Record<string, unknown>) => string
) => {
  return Object.values(DISH_TYPES).map((type) => ({
    ...type,
    label: t(`dish.types.${type.value}.label`),
    tooltip: t(`dish.types.${type.value}.tooltip`), // Ejemplo de extensión
  }));
};
