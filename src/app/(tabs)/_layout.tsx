import { Tabs } from "expo-router";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

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
          color: "#2D3748",
          fontWeight: "bold",
        },
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
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
