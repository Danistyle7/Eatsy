import { Tabs } from "expo-router";

import { Entypo, FontAwesome } from "@expo/vector-icons";

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recetas",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Entypo name="list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
