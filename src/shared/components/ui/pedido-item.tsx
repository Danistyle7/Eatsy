import React from "react";
import { View, Text, Image } from "react-native";

export type PedidoItemProps = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  usuario: string;
  estado: "Pendiente" | "En preparación" | "Listo" | "Rechazado";
  imagen: string;
};

const estadoColores: Record<PedidoItemProps["estado"], string> = {
  Pendiente: "text-yellow-500 border-yellow-500",
  "En preparación": "text-teal-500 border-teal-500",
  Listo: "text-blue-500 border-blue-500",
  Rechazado: "text-red-500 border-red-500",
};

export const PedidoItem = ({
  nombre,
  precio,
  cantidad,
  usuario,
  estado,
  imagen,
}: PedidoItemProps) => {
  const estadoColor = estadoColores[estado];

  return (
    <View
      className={`flex-row items-center border-2 rounded-lg p-3 mb-3 ${estadoColor.split(" ")[1]}`}
    >
      <Image source={{ uri: imagen }} className="w-16 h-16 rounded-md" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold">{nombre}</Text>
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">x{cantidad}</Text>
          <Text className="text-lg font-bold text-black">Bs. {precio}</Text>
        </View>
        <Text className={`text-sm font-semibold ${estadoColor.split(" ")[0]}`}>
          {estado} - {usuario}
        </Text>
      </View>
    </View>
  );
};
