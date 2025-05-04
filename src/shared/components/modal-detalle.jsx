import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import BotonNaranja from "./ui/button";
import { useUpdateDishById } from "@/features/dish/hooks";
import { useRouter } from "expo-router";

const ModalDetalle = ({ visible, onClose, item, modoCliente }) => {
  const route = useRouter();
  const [disponible, setDisponible] = useState(false);
  const updateDishById = useUpdateDishById();

  useEffect(() => {
    if (item) {
      setDisponible(item.isAvailable);
    }
  }, [item]);

  if (!item) return null;
  const toggleSwitch = () => {
    const nuevoDisponible = !disponible;
    console.log("se qu ees a ", nuevoDisponible);
    updateDishById.mutate(
      {
        id: item.id,
        data: { isAvailable: nuevoDisponible },
      },

      {
        onSuccess: () => {
          console.log("se actualiza a ", nuevoDisponible);
          setDisponible(nuevoDisponible);
        },
        onError: () => {
          console.log("Error actualizando disponibilidad");
        },
      }
    );
  };

  const pedirPlato = () => {
    console.log("Pedido realizado del plato:", item.name);
    onClose();
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
                <View>
                  <Text style={styles.title}>{item.category}</Text>
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
                    <BotonNaranja titulo="Pedir" onPress={pedirPlato} />
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
                  source={item.imageUrl}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              {/* Preparación y Botón */}
              <Text style={styles.title}>Preparación</Text>
              <View style={styles.footer}>
                <Text style={styles.time}>{item.prepTime}</Text>

                {!modoCliente && (
                  <BotonNaranja titulo="Editar" onPress={handleEdit} />
                )}
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
