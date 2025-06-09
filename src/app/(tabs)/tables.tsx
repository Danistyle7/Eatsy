import React, { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInputSubmitEditingEventData,
  View,
} from "react-native";

import { TableList } from "@/features/table/components/table-list";
import {
  useGetTables,
  useTableSocket,
  useUpdateTableById,
} from "@/features/table/hooks";
import { TableResponse } from "@/features/table/types";
import { Input } from "@/shared/components/ui";
import { FloatingButton } from "@/shared/components/ui/floating-button";
import { QRModal } from "@/shared/components/ui/qr-modal";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const [qrValue, setQrValue] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  const { isLoading, error, tables, setTables } = useGetTables();
  const { onCreated, onUpdated, onDeleted, onOccupied, cleanup } =
    useTableSocket();
  const { mutate: updateTable } = useUpdateTableById();

  const tableFiltered = tables.filter((t) =>
    searchText.length > 0 ? `mesa ${t.number}`.includes(searchText) : true
  );

  useEffect(() => {
    onCreated((newTable: TableResponse) => {
      setTables((prev = []) => [...prev, newTable]);
    });

    onUpdated((updatedTable: TableResponse) => {
      setTables((prev = []) =>
        prev.map((table) =>
          table.id === updatedTable.id ? { ...table, ...updatedTable } : table
        )
      );
    });

    onDeleted(({ id }) => {
      setTables((prev = []) => prev.filter((table) => table.id !== id));
    });

    onOccupied((updatedTable: TableResponse) => {
      setTables((prev = []) =>
        prev.map((table) =>
          table.id === updatedTable.id ? { ...table, ...updatedTable } : table
        )
      );
    });

    return cleanup;
  }, []);

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

  const handleSearch = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    setSearchText(e.nativeEvent.text.toLowerCase().trim());
  };

  const handleDetail = (table: TableResponse) => {
    router.push(`/table/${table.id}/orders`);
  };

  const handleEdit = (table: TableResponse) => {
    router.push(`/table/${table.id}/edit`);
  };

  const handleScan = (table: TableResponse) => {
    setQrValue(table.qrCodeUrl);
    setModalVisible(true);
  };

  const handleDelete = ({ id, status }: TableResponse) => {
    // TODO: Revisar la lógica de eliminación de mesas
    if (status === "DELETED") {
      console.warn("No se puede eliminar una mesa que ya está eliminada.");
      return;
    }
    const newStatus = status === "MAINTENANCE" ? "DELETED" : "MAINTENANCE";
    updateTable({ id, data: { status: newStatus } });
    setTables((prev = []) => prev.filter((table) => table.id !== id));
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
            onSubmitEditing={handleSearch}
          />
        </View>

        <TableList
          data={tableFiltered}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onScan={handleScan}
          onDelete={handleDelete}
        />
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
