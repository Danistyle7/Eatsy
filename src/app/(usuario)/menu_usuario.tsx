import Header from "@/shared/components/ui/header";
import { useGetAllDishes } from "@/features/dish/hooks";
import Section from "@/shared/components/ui/section";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView,View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export const MenuScreenUsuario = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(true);

  const {
    data: dishes,
    isLoading,
    error,refetch
  } = useGetAllDishes({ type: "FOOD", isAvailable: esCliente });

  useFocusEffect(
       useCallback(() => {
         refetch();
       }, [refetch])
     );

  console.log(dishes);

  const sampleData = dishes ?? [];

  const tiposUnicos = Array.from(
    new Set(
      sampleData
        .map((item) => item.category)
        .filter((categoria) =>
          sampleData.some(
            (item) =>
              item.category === categoria &&
              item.name.toLowerCase().includes(busqueda.toLowerCase())
          )
        )
    )
  );
  const router = useRouter();
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
        titulo="Menú"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        mostrarAgregar={false}
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

export default MenuScreenUsuario;
