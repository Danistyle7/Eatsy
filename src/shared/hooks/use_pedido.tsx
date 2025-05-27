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
export const parseEstado = (status: string): Pedido["estado"] => {
  const statusMap: Record<string, Pedido["estado"]> = {
    PENDING: "Pendiente",
    PREPARING: "En preparación",
    READY: "Listo",
    REJECTED: "Rechazado",
  };

  return statusMap[status] || "Pendiente";
};
export const mapApiToPedido = (apiData: any): Pedido => ({
  id: apiData.dish?.id?.toString(),
  nombre: apiData.dish?.name,
  precio: apiData.dish?.price,
  cantidad: apiData.item?.quantity,
  usuario: apiData.customer?.name || "Usuario",
  estado: parseEstado(apiData.item?.status?.value),
  imagen: apiData.dish?.imageUrl || "https://via.placeholder.com/150",
});
export const usePedidoStore = create<PedidoStore>((set, get) => ({
  pedidos: [],
  agregarPedidos: (nuevos) => {
    if (!nuevos.length) return;

    const existentes = get().pedidos;

    const pedidosActualizados = [...existentes];

    nuevos.forEach((nuevo) => {
      const index = pedidosActualizados.findIndex(
        (p) => p.id === nuevo.id && p.usuario === nuevo.usuario
      );
      if (index !== -1) {
        // Si ya existe, aumentar la cantidad
        pedidosActualizados[index].cantidad += nuevo.cantidad;
      } else {
        // Si no existe, agregar nuevo
        pedidosActualizados.push(nuevo);
      }
    });

    set({ pedidos: pedidosActualizados });
  },
  limpiarPedidos: () => set({ pedidos: [] }),
}));
