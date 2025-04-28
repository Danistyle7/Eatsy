import { DISH_CATEGORIES } from "./constants";
import { DishCategory, DishCategoryValue } from "./types";

/**
 * Obtiene la metadata completa de una categoría por su valor
 * @param value - Valor de la categoría (ej: "appetizer")
 * @returns Objeto con label, icon, etc.
 */
export const getDishCategory = (value: DishCategoryValue): DishCategory => {
  const category = Object.values(DISH_CATEGORIES).find(
    (c) => c.value === value
  );
  if (!category) throw new Error(`Categoría inválida: ${value}`);
  return category;
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
