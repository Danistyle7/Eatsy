import React from "react";
import { View, Text, Image } from "react-native";

export type PedidoItemProps = {
  item: {
    item: {
      id: number;
      quantity: number;
      status: {
        label: string;
        color: string;
      };
    };
    dish: {
      name: string;
      price: number;
      imageUrl: string;
    };
    customer: {
      name: string;
    };
  };
};

export const PedidoItem = ({ item }: PedidoItemProps) => {
  const {
    item: { quantity, status },
    dish: { name, price, imageUrl },
    customer: { name: customerName },
  } = item;

  return (
    <View
      className="flex-col rounded-lg px-3 pt-3 mb-3 border-2"
      style={{ borderColor: status.color }}
    >
      {/* Parte superior: Imagen y datos */}
      <View className="flex-row items-center">
        <Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-md" />

        <View className="flex-col ml-3 flex-1">
          <Text className="text-lg font-bold">{name}</Text>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">x{quantity}</Text>
            <Text className="text-lg font-bold text-black">Bs. {price}</Text>
          </View>
        </View>
      </View>

      {/* Parte inferior: Estado y usuario con fondo color */}
      <View
        className="flex-row justify-between items-center mt-2 py-1 px-3 mx-[-12px] rounded-b-lg"
        style={{ backgroundColor: status.color }}
      >
        <Text className="text-white text-sm font-bold">{status.label}</Text>
        <Text className="text-white text-sm font-bold">{customerName}</Text>
      </View>
    </View>
  );
};
