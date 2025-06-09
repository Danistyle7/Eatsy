import React, { forwardRef } from "react";
import { Link } from "expo-router";
import { Text, View, ViewProps } from "react-native";

import { Button } from "@/shared/components/ui/button";
import { TableResponse } from "../types";
import { getTableStatus } from "../utils";

import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export interface TableListItemProps extends ViewProps {
  table: TableResponse;
  onDetail?: (table: TableResponse) => void;
  onEdit?: (table: TableResponse) => void;
  onDelete?: (table: TableResponse) => void;
  onScan?: (table: TableResponse) => void;
  listKey?: string | number;
}

export const TableListItem = forwardRef<View, TableListItemProps>(
  (
    {
      table,
      onDetail = () => {},
      onEdit = () => {},
      onDelete = () => {},
      onScan = () => {},
      listKey,
      ...rest
    },
    ref
  ) => {
    return (
      <View
        key={listKey}
        ref={ref}
        className="flex-row bg-white border border-[#F97316] rounded-xl mb-2"
        {...rest}
        style={{
          backgroundColor: table.isNotification ? "#2563EB" : "#FFFFFF",
        }}
      >
        <Button
          title="Ver Detalles"
          onPress={() => onDetail(table)}
          variant="ghost"
          className="flex-1 items-start justify-between h-auto"
        >
          <View className="flex-row gap-2 items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Mesa {table.number}
            </Text>
            <Text>{getTableStatus(table.status).icon}</Text>
          </View>
        </Button>

        <View className="flex-row gap-2 align-center items-center me-4">
          <Button
            title="Editar"
            size="icon"
            variant="ghost"
            onPress={() => onEdit(table)}
          >
            <AntDesign name="edit" size={24} color="black" />
          </Button>

          <Button
            title="Ver QR"
            size="icon"
            variant="ghost"
            onPress={() => onScan(table)}
          >
            <MaterialCommunityIcons name="qrcode" size={24} color="black" />
          </Button>

          <Button
            title="Eliminar"
            size="icon"
            variant="ghost"
            onPress={() => onDelete(table)}
          >
            <FontAwesome6 name="trash-can" size={24} color="black" />
          </Button>
        </View>
      </View>
    );
  }
);

TableListItem.displayName = "TableListItem";
