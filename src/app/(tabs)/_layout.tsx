import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button } from "@/shared/components/ui/button";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f1f1",
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#4A5568",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          color: "#F97316",
          fontWeight: "bold",
        },
        tabBarLabelPosition: "below-icon",
        headerLeft: () => null, // Eliminar el botón de la izquierda
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Link href="/" asChild>
              <Button title="Salir" />
            </Link>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menú",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bebidas"
        options={{
          title: "Bebidas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-drink" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tables"
        options={{
          title: "Lista de Mesas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="table-chart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="kitchen"
        options={{
          title: "Monitor de cocina",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chef-hat" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Estilos para asegurar que el botón esté alineado correctamente
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center", // Alinea verticalmente el botón con el título
    justifyContent: "flex-end", // Alinea el botón al final de la cabecera
  },
});
