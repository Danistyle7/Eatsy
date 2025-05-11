import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button } from "@/shared/components/ui/button";

export default function TabLayout() {
  const router = useRouter();

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
          color: "#2D3748",
          fontWeight: "bold",
        },
        tabBarLabelPosition: "below-icon",
        headerLeft: () => null, // Eliminar el botón de la izquierda
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Button title="Salir" onPress={() => router.push("/")} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
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
