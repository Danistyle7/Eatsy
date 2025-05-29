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

const estadoClases: Record<
  PedidoItemProps["estado"],
  { borderColor: string; backgroundColor: string }
> = {
  Pendiente: { borderColor: "#F97316", backgroundColor: "#F97316" },
  "En preparación": { borderColor: "#10B981", backgroundColor: "#10B981" },
  Listo: { borderColor: "#2563EB", backgroundColor: "#2563EB" },
  Rechazado: { borderColor: "#F91616", backgroundColor: "#F91616" },
};

export const PedidoItem = ({
  nombre,
  precio,
  cantidad,
  usuario,
  estado,
  imagen,
}: PedidoItemProps) => {
  const clasesEstado = estadoClases[estado];

  return (
    <View
      className="flex-col rounded-lg px-3 pt-3 mb-3 border-2"
      style={{ borderColor: clasesEstado.borderColor }}
    >
      {/* Parte superior: Imagen y datos */}
      <View className="flex-row items-center">
        <Image source={{ uri: imagen }} className="w-16 h-16 rounded-md" />

        <View className="flex-col ml-3 flex-1">
          <Text className="text-lg font-bold">{nombre}</Text>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">x{cantidad}</Text>
            <Text className="text-lg font-bold text-black">Bs. {precio}</Text>
          </View>
        </View>
      </View>

      {/* Parte inferior: Estado y usuario con fondo color */}
      <View
        className="flex-row justify-between items-center mt-2 py-1 px-3 mx-[-12px] rounded-b-lg "
        style={{ backgroundColor: clasesEstado.backgroundColor }}
      >
        <Text className="text-white text-sm font-bold">{estado}</Text>
        <Text className="text-white text-sm font-bold">{usuario}</Text>
      </View>
    </View>
  );
};
