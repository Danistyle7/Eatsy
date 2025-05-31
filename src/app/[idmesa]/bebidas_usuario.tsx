import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Header from "@/shared/components/ui/header";
import { useGetAllDishes } from "@/features/dish/hooks";
import Section from "@/shared/components/ui/section";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { DISH_TYPES } from "@/features/dish/constants";
import { getDishCategory } from "@/features/dish/utils";
import { useDishesWithWebSocket } from "@/features/dish/hooks/use-socket-dish";

export const BebidaScreenUsuario = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(true);
  const { tableCode } = useLocalSearchParams();

  // Obtener datos iniciales (filtrados por disponibilidad para clientes)
  const {
    data: initialData,
    isLoading,
    error,
    refetch,
  } = useGetAllDishes({ 
    type: DISH_TYPES.DRINK.value, 
    isAvailable: esCliente 
  });

  // Usar WebSocket con filtro para DRINK y contexto cliente
  const dishes = useDishesWithWebSocket(initialData, {
    filterType: "DRINK",
    isAdmin: false // Cliente solo ve disponibles
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Estados de carga
  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  // Obtener categorías únicas filtradas por búsqueda (usando dishes con WebSocket)
  const tiposUnicos = Array.from(
    new Set(
      dishes
        ?.map((item) => item.category)
        ?.filter((category) =>
          dishes?.some(
            (item) =>
              item.category === category &&
              item.name.toLowerCase().includes(busqueda.toLowerCase())
          )
        ) ?? []
    )
  );

  // Función para filtrar por tipo y búsqueda (usando dishes)
  const filtrarPorTipo = (category: string) =>
    dishes?.filter(
      (item) =>
        item.category === category &&
        item.name.toLowerCase().includes(busqueda.toLowerCase())
    ) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Header
          titulo="Bebidas"
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          mostrarAgregar={false}
          idmesa={tableCode}
        />
      </View>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        {tiposUnicos.map((tipo) => {
          const items = filtrarPorTipo(tipo);
          if (items.length === 0) return null;

          return (
            <Section
              key={tipo}
              title={getDishCategory(tipo).label}
              data={items}
              {...{
                modalVisible,
                setModalVisible,
                selectedItem,
                setSelectedItem,
              }}
              esCliente={esCliente}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BebidaScreenUsuario;