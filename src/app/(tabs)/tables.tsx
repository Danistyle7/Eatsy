import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { TableList } from "@/features/table/components/table-list";
import { useGetTables } from "@/features/table/hooks";
import { TableResponse } from "@/features/table/types";
import { Input } from "@/shared/components/ui";
import { FloatingButton } from "@/shared/components/ui/floating-button";
import { QRModal } from "@/shared/components/ui/qr-modal";

export default function Screen() {
  const [qrValue, setQrValue] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  const { isLoading, error, tables } = useGetTables();

  if (isLoading)
    return <Text className="flex-1 text-center mt-4">Cargando...</Text>;
  if (error)
    return (
      <Text className="flex-1 text-center mt-4 text-red-600">
        Error al cargar mesas: {error.message}
      </Text>
    );
  if (!tables?.length)
    return (
      <Text className="flex-1 text-center mt-4">No hay mesas disponibles</Text>
    );

  const handleSearch = () => {
    console.log("Filtrar mesas por:", searchText);
  };

  const handleScan = (table: TableResponse) => {
    setQrValue(table.qrCodeUrl);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      setQrValue("");
    }, 500);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-1">
        {/* buscador por numero de mesa */}
        <View className="flex-row gap-2 items-center mb-4">
          <Input
            placeholder="Buscar por número de mesa"
            className="flex-1 bg-gray-100 shadow-sm"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
        </View>

        <TableList data={tables} onScan={handleScan} />
      </ScrollView>

      <QRModal
        title="Código QR de la mesa"
        visible={modalVisible}
        qrCodeUrl={qrValue}
        onClose={handleClose}
      />

      <FloatingButton href="/table/new" icon="add" />
    </View>
  );
}
