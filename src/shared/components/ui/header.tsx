import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Button } from "./button";

type HeaderProps = {
  titulo: string;
  busqueda?: string;
  setBusqueda?: (text: string) => void;
  mostrarBusqueda?: boolean;
  mostrarAgregar?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  titulo,
  busqueda = "",
  setBusqueda = () => {},
  mostrarBusqueda = true,
  mostrarAgregar = true,
}) => {
  return (
    <View style={{ marginBottom: 10 }}>
      {/* Iconos de cabecera */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ transform: [{ scaleX: -1 }] }}>
          <FontAwesome5 name="fish" size={35} color="#EF6C00" />
        </View>
        <FontAwesome5 name="user-circle" size={35} color="#EF6C00" />
      </View>

      {/* Título y botón */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
          marginTop: 4,
        }}
      >
        <Text style={{ color: "#EF6C00", fontSize: 24, fontWeight: "bold" }}>
          {titulo}
        </Text>
        {mostrarAgregar && (
          <Link href="/dish/new" asChild>
            <Button title="Agregar" />
          </Link>
        )}
      </View>

      {/* Buscador */}
      {mostrarBusqueda && (
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
      )}
    </View>
  );
};

export default Header;
