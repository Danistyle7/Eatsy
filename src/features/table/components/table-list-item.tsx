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
  onEdit?: (table: TableResponse) => void;
  onDelete?: (table: TableResponse) => void;
  onScan?: (table: TableResponse) => void;
  listKey?: string | number;
}

export const TableListItem = forwardRef<View, TableListItemProps>(
  (
    {
      table,
      onEdit = () => {},
      onDelete = () => {},
      onScan = () => {},
      listKey,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <View
        key={listKey}
        ref={ref}
        style={style}
        className="flex-row bg-white px-4 py-2 border border-[#F97316] rounded-xl justify-between mb-2"
        {...rest}
      >
        <View className="flex-row gap-2 items-center">
          <Text className="text-lg font-semibold text-gray-800">
            Mesa {table.number}
          </Text>
          <Text>{getTableStatus(table.status).icon}</Text>
        </View>

        <View className="flex-row gap-2">
          <Link href={`/table/${table.id}/edit`} asChild>
            <Button
              title="Editar"
              size="icon"
              variant="ghost"
              onPress={() => onEdit(table)}
            >
              <AntDesign name="edit" size={24} color="black" />
            </Button>
          </Link>

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
