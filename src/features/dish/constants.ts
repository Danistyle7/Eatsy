export const DISH_QUERY_KEYS = {
  all: ["dishes"],
  lists: () => [...DISH_QUERY_KEYS.all, "list"],
  details: () => [...DISH_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...DISH_QUERY_KEYS.details(), id],
};

export const DISH_CATEGORIES = {
  APPETIZER: {
    value: "APPETIZER",
    label: "Entrada",
    icon: "🍞",
    color: "bg-amber-100",
  },
  // ... otras categorías
} as const;

// Tipo para valores puros (API/DB)
export type DishCategoryValue =
  (typeof DISH_CATEGORIES)[keyof typeof DISH_CATEGORIES]["value"];
