// screens/MesaScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { PedidoItem } from "@/shared/components/ui/pedido-item";
import type { PedidoItemProps } from "@/shared/components/ui/pedido-item";
import Header from "@/shared/components/ui/header";
import { useLocalSearchParams } from "expo-router";
import { usePedidoStore } from "@/shared/hooks/use_pedido";

const statusMap: Record<string, PedidoItemProps["estado"]> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  READY: "Listo",
  REJECTED: "Rechazado",
};
const parseEstado = (status: string): PedidoItemProps["estado"] => {
  return statusMap[status] || "Pendiente"; // default para valores no contemplados
};
export default function MesaScreen() {
  const { tableCode, idUsuario, data } = useLocalSearchParams();
  const { pedidos, agregarPedidos } = usePedidoStore();

  useEffect(() => {
    const parsedData = data ? JSON.parse(data as string) : null;

    const nuevosPedidos: PedidoItemProps[] =
      parsedData?.items?.map((item: any) => ({
        id: item.id_dish.toString(),
        nombre: item.name_dish,
        precio: item.price,
        cantidad: item.quantity,
        usuario: item.name_customer || "Usuario",
        estado: parseEstado(item.status),
        imagen: item.imageUrl || "https://via.placeholder.com/150",
      })) || [];

    agregarPedidos(nuevosPedidos);
  }, [data]);

  const totalProductos = pedidos.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = pedidos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <View style={styles.container}>
      <Header
        titulo="Estado de pedidos"
        mostrarBusqueda={false}
        mostrarAgregar={false}
        idmesa={tableCode}
      />

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PedidoItem {...item} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total: {totalProductos} Productos</Text>
        <Text style={styles.footerText}>Bs. {totalPrecio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  list: {
    paddingBottom: 80,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
