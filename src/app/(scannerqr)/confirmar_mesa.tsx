import { useState } from "react"; // ✅ DEBE IR ARRIBA

import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetTableByQrCode } from "@/features/table/hooks";
import { Button } from "@/shared/components/ui/button";
export default function ConfirmarMesa() {
  const router = useRouter();
  const { tableCode } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const qrCode = Array.isArray(tableCode) ? tableCode[0] : (tableCode ?? "");

  const { refetch, data, isFetching, error } = useGetTableByQrCode(
    qrCode,
    nombre
  );

  const handleContinue = async () => {
    if (!nombre.trim()) return;
    setIsLoading(true);

    const { data, error } = await refetch();

    setIsLoading(false);
    if (!data || error) return;

    router.replace({
      pathname: `/${data.table.number}/menu_usuario`,
      params: {
        tableCode: data.table.number.toString(),
        idMesa: data.table.id.toString(),
        idUsuario: data.customer.id.toString(),
        nombreUsuario: data.customer.name_customer,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el código{"\n"}QR de tu mesa</Text>
      <View style={styles.iconBox}>
        <Ionicons name="checkmark" size={80} color="white" />
      </View>
      <Text style={styles.tableCode}>{tableCode}</Text>

      <Text style={styles.label}>Introduzca su nombre</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <Ionicons name="person-circle" size={24} color="gray" />
      </View>
      <Button
        title={isLoading ? "Cargando..." : "Continuar"}
        onPress={handleContinue}
        disabled={isLoading || !nombre.trim()}
        className="w-full mt-6"
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 18,
    color: "#f97316", // naranja
  },
  iconBox: {
    marginTop: 30,
    backgroundColor: "#f97316",
    padding: 35,
    borderRadius: 20,
  },
  tableCode: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 30,
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
