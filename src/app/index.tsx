import { useRouter } from "expo-router";
import { View, Button } from "react-native";
export default function Home() {
    const router = useRouter();
  
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Entrar como Administrador" onPress={() => router.push("/(tabs)/menu")} />
        <Button title="Entrar como Usuario" onPress={() => router.push("/(usuario)/menu_usuario")} />
      </View>
    );
  }