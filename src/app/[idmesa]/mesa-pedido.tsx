// screens/MesaScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { PedidoItem } from "@/shared/components/ui/pedido-item";
import Header from "@/shared/components/ui/header";
import { useLocalSearchParams } from "expo-router";
import { usePedidoStore, mapApiToPedido } from "@/shared/hooks/use_pedido";
import { useGetOrderByTableId } from "@/features/order/hooks";

export default function MesaScreen() {
  const { tableCode, idUsuario, idMesa } = useLocalSearchParams();
  const { pedidos, agregarPedidos } = usePedidoStore();

  const { data, error, isLoading } = useGetOrderByTableId(Number(idMesa));
  console.log("data de la mesa", data);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    usePedidoStore.getState().limpiarPedidos();
    const nuevosPedidos = data.map(mapApiToPedido);
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
