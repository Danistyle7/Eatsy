import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useUpdateDishById } from "@/features/dish/hooks";
import { getDishCategory } from "@/features/dish/utils";
import { useCartStore } from "../hooks/use_cardstore";
import { Button } from "./ui/button";

const ModalDetalle = ({ visible, onClose, item, modoCliente }) => {
  const { idmesa, tableCode } = useLocalSearchParams();
  const route = useRouter();
  const [disponible, setDisponible] = useState(false);
  const updateDishById = useUpdateDishById();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (item) {
      setDisponible(item.isAvailable);
    }
  }, [item]);

  if (!item) return null;
  const toggleSwitch = () => {
    const nuevoDisponible = !disponible;

    updateDishById.mutate(
      {
        id: item.id,
        data: { isAvailable: nuevoDisponible },
      },

      {
        onSuccess: () => {
          setDisponible(nuevoDisponible);
        },
        onError: () => {},
      }
    );
  };

  const pedirPlato = () => {
    addItem(item);
    onClose();
    route.navigate(`/${tableCode}/pedidos`);
  };

  const handleEdit = () => {
    onClose();
    route.navigate(`/dish/${item.id}/edit`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalContainer} onPress={() => {}}>
              {/* Header */}
              <View style={styles.header}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.title}>
                    {getDishCategory(item.category).label}
                  </Text>
                  <Text style={styles.etiqueta}>{item.name}</Text>
                </View>

                {!modoCliente && (
                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.title}>Disp.</Text>
                      <Switch
                        value={disponible}
                        onValueChange={toggleSwitch}
                        thumbColor={disponible ? "#fff" : "#fff"}
                        trackColor={{ false: "#ccc", true: "#FF9800" }}
                      />
                    </View>
                    <Text style={styles.price}>Bs. {item.price}</Text>
                  </View>
                )}

                {modoCliente && (
                  <View style={{ alignItems: "flex-end" }}>
                    <Button title="Pedir" onPress={pedirPlato} />
                    <Text style={styles.price}>Bs. {item.price}</Text>
                  </View>
                )}
              </View>

              {/* Descripción */}
              <Text style={styles.title}>Descripción</Text>
              <Text style={styles.description}>{item.description}</Text>

              {/* Imagen */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              {/* Preparación y Botón */}
              <Text style={styles.title}>Preparación</Text>
              <View style={styles.footer}>
                <Text style={styles.time}>{item.prepTime}</Text>

                {!modoCliente && <Button title="Editar" onPress={handleEdit} />}
              </View>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalDetalle;

// Estilos
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(175, 166, 166, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    flexShrink: 1,
  },
  etiqueta: {
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF9800",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 48,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
  },
});
