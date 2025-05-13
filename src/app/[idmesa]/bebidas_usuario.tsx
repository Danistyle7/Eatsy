import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Header from "@/shared/components/ui/header";
import { useGetAllDishes } from "@/features/dish/hooks";
import Section from "@/shared/components/ui/section";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useLocalSearchParams } from 'expo-router';
import { DISH_TYPES } from "@/features/dish/constants";
export const BebidaScreenUsuario = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [esCliente, setEsCliente] = useState(true);

 const { idmesa } = useLocalSearchParams();

  const { data: bebidas, isLoading, error,refetch } = useGetAllDishes({ type: DISH_TYPES.DRINK.value,   isAvailable: esCliente,});

   useFocusEffect(
       useCallback(() => {
         refetch();
       }, [refetch])
     );

  console.log("que es aqui ",idmesa);
  const sampleData = bebidas ?? [];

  const tiposUnicos = Array.from(
    new Set(
      sampleData
        .map((item) => item.category)
        .filter((category) =>
          sampleData.some(
            (item) =>
              item.category === category &&
              item.name.toLowerCase().includes(busqueda.toLowerCase())
          )
        )
    )
  );

  // Función para filtrar por tipo y búsqueda
  const filtrarPorTipo = (category: string) =>
    sampleData.filter(
      (item) =>
        item.category === category &&
        item.name.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (

    <View style={{ flex: 1, backgroundColor: "white" }}>
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
    <Header
        titulo="Bebidas"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      mostrarAgregar = {false}
      idmesa={idmesa}
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
      {/* Secciones dinámicas por cada tipo único */}
      {tiposUnicos.map((tipo) => {
        const items = filtrarPorTipo(tipo);
        if (items.length === 0) return null; // evita secciones vacías

        return (
          <Section
            key={tipo}
            title={tipo}
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
