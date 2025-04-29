import { DishParams } from "./types";

export const DISH_QUERY_KEYS = {
  all: ["dishes"],
  lists: (params?: DishParams) => [...DISH_QUERY_KEYS.all, "list", params],
  details: () => [...DISH_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...DISH_QUERY_KEYS.details(), id],
};

export const DISH_CATEGORIES = {
  APPETIZER: { value: "APPETIZER", label: "Entrada", icon: "🍞" },
  SALAD: { value: "SALAD", label: "Ensalada", icon: "🥗" },
  MAIN_COURSE: { value: "MAIN_COURSE", label: "Plato Principal", icon: "🍛" },
  DESSERT: { value: "DESSERT", label: "Postre", icon: "🍰" },
  BURGERS: { value: "BURGERS", label: "Hamburguesas", icon: "🍔" },
  TEA: { value: "TEA", label: "Té", icon: "🍵" },
  SODA: { value: "SODA", label: "Refresco", icon: "🥤" },
  JUICE: { value: "JUICE", label: "Jugo Natural", icon: "🧃" },
  COFFEE: { value: "COFFEE", label: "Café", icon: "☕" },
  OTHER: { value: "OTHER", label: "Otro", icon: "❓" },
} as const;

export const DISH_TYPES = {
  FOOD: { value: "FOOD", label: "Comida", icon: "🍔" },
  DRINK: { value: "DRINK", label: "Bebida", icon: "🍹" },
};
