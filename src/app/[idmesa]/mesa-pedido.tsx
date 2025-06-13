import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  useGetOrderByTableId,
  useOrderItemSocket,
} from "@/features/order/hooks";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/ui/header";
import ModalMesa from "@/shared/components/ui/modal-mesa";
import { PedidoItem } from "@/shared/components/ui/pedido-item";
import { useTableCode, useTableId, useUserName } from "@/storage/hook";
import { orderService } from "@/features/order/service";
import { ORDER_STATUSES } from "@/features/order/constants";
import { useTableSocket } from "@/features/table/hooks";
export default function MesaScreen() {
  const tableCode = useTableCode();
  const idMesa = useTableId();
  const userName = useUserName();
  const [modalVisible, setModalVisible] = useState(false);
  const { orders, error, isLoading, setOrder } = useGetOrderByTableId(
    Number(idMesa)
  );

  const [loading, setLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const { onUpdated: onMesaUpdated } = useTableSocket();
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

  useEffect(() => {
    const unsubMesaUpdated = onMesaUpdated(async (mesaActualizada) => {
      if (
        mesaActualizada.id === Number(idMesa) &&
        mesaActualizada.isNotification === true
      ) {
        try {
          const response = await orderService.getReadyByTableId(Number(idMesa));
          if (!response.success) return;

          router.push({
            pathname: "/menupag/detalle-pedido",
            params: {
              recibo: JSON.stringify({ data: response.data }),
            },
          });
        } catch (e) {
          console.error("Error al obtener pedidos desde socket:", e);
        }
      }
    });

    return () => {
      unsubMesaUpdated();
    };
  }, [idMesa]);

  const todasOrdenesCompletas =
    orders.length > 0 &&
    orders.every(
      ({ order }) =>
        order._base.status === ORDER_STATUSES.READY.value ||
        order._base.status === ORDER_STATUSES.CANCELLED.value
      // ||
      // order._base.status === ORDER_STATUSES.DELIVERED.valu
    );

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

  const confirmarRecivo = async () => {
    if (!idMesa) return;

    setLoading(true);
    setLocalError(null);

    try {
      const response = await orderService.getReadyByTableId(Number(idMesa));

      if (!response.success) {
        setLoading(false);
        return;
      }
      // Actualizas la lista en el hook para que se refleje

      router.push({
        pathname: "/menupag/detalle-pedido",
        params: {
          recibo: JSON.stringify({ data: response.data }),
        },
      });
    } catch (e) {
      setLocalError("Error al obtener los pedidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        titulo="Estado de pedidos"
        mostrarBusqueda={false}
        mostrarAgregar={false}
        idmesa={tableCode ?? ""}
        nombre={userName ?? ""}
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
            disabled={!todasOrdenesCompletas}
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
