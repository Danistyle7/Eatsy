import { create } from "zustand";

export interface Dish { // ✅ Añadido export aquí
  id: string;
  name: string;
  price: number;
  count: number;
  imageUrl: string;
}

interface CartStore {
  items: Dish[];
  addItem: (item: Dish) => void;
  clearCart: () => void;
  incrementarItem: (id: string) => void;
  decrementarItem: (id: string) => void;
  removeItem: (id: string) => void; 
    getTotal: () => number;
}


export const useCartStore = create<CartStore>((set,get) => ({
  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.count, 0);
  },

removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  incrementarItem: (id) =>
  set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    ),
  })),

decrementarItem: (id) =>
  set((state) => ({
    items: state.items
      .map((item) =>
        item.id === id && item.count > 1
          ? { ...item, count: item.count - 1 }
          : item
      )

  })),
  items: [],

  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === newItem.id
              ? { ...item, count: item.count + 1 }
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, { ...newItem, count: 1 }],
        };
      }
    }),
  clearCart: () => set({ items: [] }),
}));
