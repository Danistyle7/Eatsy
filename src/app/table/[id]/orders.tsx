import { Link, useLocalSearchParams } from "expo-router";

import { useGetOrdersReadyByTableId } from "@/features/order/hooks";
import { Modal, ScrollView, Text, View } from "react-native";
import { groupBy } from "@/shared/lib/utils";
import { useGetTableById, usePayTable } from "@/features/table/hooks";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

export default function Screen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = Number(idString);
  if (isNaN(id)) return <Text>Invalid table ID</Text>;

  const [modalVisible, setModalVisible] = useState(false);

  const {
    isLoading: isLoadingTable,
    error: errorTable,
    table,
  } = useGetTableById(id);
  // TODO: enviar desde el backend toda la información de la mesa
  const {
    isLoading: isLoadingOrders,
    error: errorOrders,
    orders,
  } = useGetOrdersReadyByTableId(id);
  const { mutate: payTable } = usePayTable();

  const isLoading = isLoadingTable || isLoadingOrders;
  const error = errorTable || errorOrders;

  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!table) return <Text>Mesa no encontrada</Text>;
  if (!orders || orders.length === 0) return <Text>No hay pedidos</Text>;

  const grouped = groupBy(orders, (order) => order.customer.id);
  const total = Object.values(grouped).reduce(
    (acc, orders) =>
      acc +
      orders.reduce(
        (acc, { dish, item }) => acc + dish.price * item.quantity,
        0
      ),
    0
  );

  const handleConfirm = () => {
    setModalVisible(false);
    console.log("Confirmar");
  };

  return (
    <View className="flex-1 bg-white">
      {/* header */}
      <View className="flex-col justify-center min-h-52 gap-2">
        {/* title */}
        <Text className="text-3xl font-semibold text-center text-[#F97316]">
          Detalles Mesa {table.number}
        </Text>
        <Text className="text-3xl font-semibold text-center text-[#F97316]">
          Caja 1 #0213
        </Text>
      </View>

      {/* body */}
      <View className="flex-1 bg-red-400 mx-4">
        {/* FlatList */}
        <ScrollView
          className="flex-1 bg-white gap-2"
          contentContainerStyle={{ paddingBottom: 70, gap: 8 }}
        >
          {/* TODO: crear componente para cada pedido */}
          {Object.entries(grouped).map(([userId, orders]) => {
            const user = orders[0].customer;
            const subtotal = orders.reduce(
              (acc, order) => acc + order.dish.price * order.item.quantity,
              0
            );
            return (
              <View
                key={userId}
                className="flex-col justify-between bg-gray-200 px-4 py-2 rounded-lg"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xl font-semibold text-gray-700">
                    {user.name}
                  </Text>

                  {/* subtotal */}
                  <View className="flex-row justify-between">
                    <Text className="text-base font-semibold text-gray-700">
                      Bs. {subtotal.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View className="flex-1 bg-gray-100 px-4 py-2 rounded-lg">
                  {orders.map(({ item, dish }) => (
                    <View
                      key={item.id}
                      className="flex-row gap-2 justify-between"
                    >
                      <View className="flex-row gap-2">
                        <Text className="text-lg font-semibold text-gray-800">
                          x {item.quantity}
                        </Text>
                        <Text className="text-lg font-semibold text-gray-800">
                          {dish.name}
                        </Text>
                      </View>
                      <Text className="text-lg font-semibold text-gray-800">
                        Bs. {dish.price.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* footer */}
      <View className="flex-col justify-center px-4 py-2 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold text-gray-700">Total:</Text>
          <Text className="text-xl font-semibold text-gray-700">
            Bs. {total.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row justify-between px-4 py-2 gap-4">
          <Link href="/tables" asChild>
            <Button
              title="Volver"
              variant="outline"
              className="flex-1"
              size="sm"
            />
          </Link>

          <Button
            title="Cuenta pagada"
            onPress={() => setModalVisible(true)}
            className="flex-1"
            size="sm"
          />
        </View>
      </View>
      {/* modal */}
      <ReciboModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

interface ConfirmModal {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ReciboModal = ({ visible, onClose, onConfirm }: ConfirmModal) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl px-8 py-4 w-full max-w-md">
          <Text className="text-xl font-semibold text-center mb-2 text-[#F97316]">
            Cuenta pagada
          </Text>

          <View className="bg-white items-start">
            {/* texto de confirmación: La mesa se hará disponible.
¿Estás seguro? */}
            <Text className="text-base text-gray-700">
              La mesa se hará disponible.
            </Text>
            <Text className="text-base text-gray-700">¿Estás seguro?</Text>
          </View>

          <View className="flex-row mt-6 gap-8">
            <Button
              title="Cerrar"
              onPress={onClose}
              variant="outline"
              className="flex-1"
              size="sm"
            />
            <Button
              title="Confirmar"
              onPress={onConfirm}
              className="flex-1"
              size="sm"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
