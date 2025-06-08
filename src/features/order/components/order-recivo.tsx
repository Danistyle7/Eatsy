// utils/generarRecibo.ts

export type OrderBase = {
  id_order: number;
  id_order_item: number;
  status: string;
  quantity: number;
  id_table: number;
  id_customer: number;
  name_customer: string;
  id_dish: number;
  name_dish: string;
  price: number;
  type: string;
  description: string;
  isAvailable: boolean;
  imageUrl: string;
  prepTime: number;
};

export type OrderItem = {
  order: {
    id: number;
    _base: OrderBase;
  };
};

export type PlatoItem = {
  id_order_item: number;
  id_dish: number;
  name_dish: string;
  description: string;
  type: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

export type ReciboCliente = {
  id_customer: number;
  name_customer: string;
  platos: PlatoItem[];
  total: number;
};

export type ReciboResultado = {
  usuarios: ReciboCliente[];
  totalGeneral: number;
};

export function generarReciboDesdeOrders(orders: OrderItem[]): ReciboResultado {
  const reciboPorCliente: {
    [id: number]: ReciboCliente;
  } = {};

  orders.forEach(({ order }) => {
    const item = order._base;

    if (item.status === "READY") {
      const id = item.id_customer;

      if (!reciboPorCliente[id]) {
        reciboPorCliente[id] = {
          id_customer: id,
          name_customer: item.name_customer,
          platos: [],
          total: 0,
        };
      }

      reciboPorCliente[id].platos.push({
        id_order_item: item.id_order_item,
        id_dish: item.id_dish,
        name_dish: item.name_dish,
        description: item.description,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      });

      reciboPorCliente[id].total += item.price * item.quantity;
    }
  });

  const usuarios = Object.values(reciboPorCliente);
  const totalGeneral = usuarios.reduce(
    (acc, cliente) => acc + cliente.total,
    0
  );

  return { usuarios, totalGeneral };
}
