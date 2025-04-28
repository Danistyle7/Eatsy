import { DishParams } from "./types";

export const DISH_QUERY_KEYS = {
  all: ["dishes"],
  lists: (params?: DishParams) => [...DISH_QUERY_KEYS.all, "list", params],
  details: () => [...DISH_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...DISH_QUERY_KEYS.details(), id],
};

export const DISH_CATEGORIES = {
  APPETIZER: { value: "appetizer", label: "Entrada", icon: "🍞" },
  SALAD: { value: "salad", label: "Ensalada", icon: "🥗" },
  MAIN_COURSE: { value: "main_course", label: "Plato Principal", icon: "🍛" },
  DESSERT: { value: "dessert", label: "Postre", icon: "🍰" },
  BURGERS: { value: "burgers", label: "Hamburguesas", icon: "🍔" },
  TEA: { value: "tea", label: "Té", icon: "🍵" },
  SODA: { value: "soda", label: "Refresco", icon: "🥤" },
  JUICE: { value: "juice", label: "Jugo Natural", icon: "🧃" },
  COFFEE: { value: "coffee", label: "Café", icon: "☕" },
  OTHER: { value: "other", label: "Otro", icon: "❓" },
} as const;

export const DISH_TYPES = {
  FOOD: { value: "food", label: "Comida", icon: "🍔" },
  DRINK: { value: "drink", label: "Bebida", icon: "🍹" },
};
