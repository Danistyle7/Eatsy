import React, { useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { Ionicons as FishSymbol, AntDesign as User } from "@expo/vector-icons";
import BotonNaranja from "@/components/ui/button";
import Section from "@/components/ui/section";

const sampleData = [
  {
    id: 1,
    nombre: "Silpancho",
    descripcion: "Carne empanizada, arroz y huevo.",
    precio: 55,
    stok: 10,
    disponible: true,
    categoria: "plato",
    imagen: {
      uri: "https://example.com/silpancho.jpg",
    },
    tiempoCocion: "20 min",
  },
  {
    id: 2,
    nombre: "Mocochinchi",
    descripcion: "Jugo de durazno seco.",
    precio: 15,
    stok: 30,
    disponible: true,
    categoria: "bebida",
    imagen: {
      uri: "https://example.com/mocochinchi.jpg",
    },
    tiempoCocion: "5 min",
  },
  {
    id: 3,
    nombre: "Helado",
    descripcion: "Dulce frío de leche.",
    precio: 10,
    stok: 20,
    disponible: false,
    categoria: "postre",
    imagen: {
      uri: "https://example.com/helado.jpg",
    },
    tiempoCocion: "0 min",
  },
];

export const MenuScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const filtrarPorCategoria = (categoria: string) =>
    sampleData.filter(
      (item) =>
        item.categoria === categoria &&
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ transform: [{ scaleX: -1 }] }}>
          <FishSymbol size={50} color="#EF6C00" />
        </View>
        <User size={40} color="#EF6C00" />
      </View>

      {/* Buscador y botón */}
      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text style={{ color: "#EF6C00", fontSize: 24, fontWeight: "bold" }}>
            Menu
          </Text>
          <BotonNaranja
            titulo="Agregar"
            onPress={() => console.log("Agregar presionado")}
          />
        </View>

        <TextInput
          placeholder="Buscar..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            fontSize: 16,
            backgroundColor: "#f9f9f9",
          }}
        />
      </View>

      {/* Secciones filtradas dinámicamente */}
      <Section
        title="Platos"
        data={filtrarPorCategoria("plato")}
        {...{ modalVisible, setModalVisible, selectedItem, setSelectedItem }}
      />
      <Section
        title="Bebidas"
        data={filtrarPorCategoria("bebida")}
        {...{ modalVisible, setModalVisible, selectedItem, setSelectedItem }}
      />
      <Section
        title="Postres"
        data={filtrarPorCategoria("postre")}
        {...{ modalVisible, setModalVisible, selectedItem, setSelectedItem }}
      />
    </ScrollView>
  );
};

export default MenuScreen;
