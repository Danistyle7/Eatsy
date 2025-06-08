import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "@/shared/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
const DetallePedido = () => {
  const { tableCode, idUsuario, idMesa } = useLocalSearchParams();
  const mensaje = "hola";

  const total = 20;
  const volverInicio = () => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="bg-white ">
        <View className="items-center ">
          <Text className="text-2xl text-[#F97316]">
            Detalle de Mesa:{total}
          </Text>
        </View>
      </ScrollView>
      <View className="flex-col  p-4">
        <View>
          <View className="flex-row justify-between ">
            <Text className="text-[#F97316] text-lg">Total:</Text>
            <Text className="text-lg">Bs:{total}</Text>
          </View>
          <Text className="justify-center text-center mb-12 text-2xl text-[#F97316]">
            Gracias por su visita
          </Text>
        </View>
        <View className="justify-center items-center ">
          <Button title="Volver al inicio" onPress={volverInicio} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetallePedido;
