import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import {
  generarReciboDesdeOrders,
  OrderItem,
} from "@/features/order/components/order-recivo";
import {
  useGetOrderByTableId,
  useOrderItemSocket,
} from "@/features/order/hooks";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/ui/header";
import ModalMesa from "@/shared/components/ui/modal-mesa";
import { PedidoItem } from "@/shared/components/ui/pedido-item";

export default function MesaScreen() {
  const { tableCode, idMesa } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const { orders, error, isLoading, setOrder } = useGetOrderByTableId(
    Number(idMesa)
  );
  const { onCreated, onUpdated, cleanup } = useOrderItemSocket();

  useEffect(() => {
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
  const totalProductos = orders.reduce(
    (acc, { item }) => acc + item.quantity,
    0
  );
  const totalPrecio = orders.reduce(
    (acc, { dish, item }) => acc + dish.price * item.quantity,
    0
  );

  const confirmarRecivo = () => {
    const { usuarios, totalGeneral } = generarReciboDesdeOrders(
      orders as OrderItem[]
    );

    router.push({
      pathname: "/menupag/detalle-pedido",
    });
  };

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
        contentContainerStyle={{ paddingBottom: 70 }}
      />
      <View style={styles.footer} className="flex-col">
        <View className="flex-row justify-between">
          <Text style={styles.footerText}>
            Total: {totalProductos} Productos
          </Text>
          <Text style={styles.footerText}>Bs. {totalPrecio}</Text>
        </View>
        <View className="items-center P-1">
          <Button
            onPress={() => setModalVisible(true)}
            title="Generar detalle "
          />
        </View>
      </View>

      <ModalMesa
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          confirmarRecivo();
        }}
      />
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
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
