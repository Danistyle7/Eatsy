import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import "./global.css";
import Test from "./components/test";

export default function App() {
  return (
    <View style={styles.container} className="bg-white">
      <Test />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
