import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Layout() {
  return (
    <View className="flex-1 bg-black">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "yellow",
          headerTitle: "",
          headerLeft: () => <View></View>,
          headerRight: () => (
            <Link asChild href="/about">
              <Pressable>
                <Text>About</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
    </View>
  );
}
