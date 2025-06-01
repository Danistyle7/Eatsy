// screens/MesaScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  PedidoItem,
  PedidoItemProps,
} from "@/shared/components/ui/pedido-item";
import Header from "@/shared/components/ui/header";
import { useLocalSearchParams } from "expo-router";
import { setupOrderListeners } from "@/shared/lib/socket/socketListeners";
import { useGetOrderByTableId } from "@/features/order/hooks";

export default function MesaScreen() {
  const { tableCode, idUsuario, idMesa } = useLocalSearchParams();

  const { orders, error, isLoading, setOrder } = useGetOrderByTableId(
    Number(idMesa)
  );
  console.log("data de la mesa", orders);
  useEffect(() => {
    const { onCreated, onUpdated, cleanup } = setupOrderListeners();

    onCreated((newOrder) => {
      setOrder((prev = []) => [...prev, newOrder]);
    });

    onUpdated((updatedOrder) => {
      setOrder((prev = []) =>
        prev.map((order) =>
          order.item.id === updatedOrder.item.id
            ? { ...order, ...updatedOrder }
            : order
        )
      );
    });

    return cleanup;
  }, [setOrder]);
  // const totalProductos = pedidos.reduce((acc, item) => acc + item.cantidad, 0);
  // const totalPrecio = pedidos.reduce(
  //   (acc, item) => acc + item.precio * item.cantidad,
  //   0
  // );
  const totalProductos =
    orders?.reduce((acc, item) => acc + item.order._base.quantity, 0) ?? 0;
  const totalPrecio =
    orders?.reduce(
      (acc, item) => acc + item.dish.price * item.order._base.quantity,
      0
    ) ?? 0;
  return (
    <View style={styles.container}>
      <Header
        titulo="Estado de pedidos"
        mostrarBusqueda={false}
        mostrarAgregar={false}
        idmesa={tableCode}
      />

      <FlatList
        data={orders}
        renderItem={({ item }) => <PedidoItem item={item} />}
        keyExtractor={(item) => item.item.id.toString()}
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
