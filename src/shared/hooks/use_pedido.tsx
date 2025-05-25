import { create } from "zustand";
export interface Pedido {
  id: string; // usamos id_dish como clave
  nombre: string;
  precio: number;
  cantidad: number;
  usuario: string;
  estado: "Pendiente" | "En preparación" | "Listo" | "Rechazado";
  imagen: string;
}

interface PedidoStore {
  pedidos: Pedido[];
  agregarPedidos: (nuevos: Pedido[]) => void;
  limpiarPedidos: () => void;
}
export const usePedidoStore = create<PedidoStore>((set, get) => ({
  pedidos: [],
  agregarPedidos: (nuevos) => {
    if (!nuevos.length) return; // no hacer nada si array vacío
    const existentes = get().pedidos;
    const sinDuplicados = nuevos.filter(
      (nuevo) => !existentes.some((p) => p.id === nuevo.id)
    );
    set({ pedidos: [...existentes, ...sinDuplicados] });
  },
  limpiarPedidos: () => set({ pedidos: [] }),
}));
