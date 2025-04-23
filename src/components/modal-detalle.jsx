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

const ModalDetalle = ({ visible, onClose, item }) => {
  const [disponible, setDisponible] = useState(false);

  useEffect(() => {
    if (item) {
      setDisponible(item.disponible); // Sincronizar con el prop al abrir el modal
    }
  }, [item]);

  if (!item) return null;

  const toggleSwitch = () => setDisponible((previous) => !previous);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            {/* Header con nombre, precio y switch */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Plato</Text>
                <Text style={styles.etiqueta}>{item.nombre}</Text>
              </View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.title}>Disp.</Text>
                  <Switch
                    value={disponible}
                    onValueChange={toggleSwitch}
                    thumbColor={disponible ? "#fff" : "#fff"}
                    trackColor={{ false: "#ccc", true: "#FF9800" }}
                  />
                </View>
                <Text style={styles.price}>Bs. {item.precio}</Text>
              </View>
            </View>

            {/* Descripción */}
            <Text style={styles.title}>Descripción</Text>
            <Text style={styles.description}>{item.descripcion}</Text>

            {/* Imagen */}
            <View style={styles.imageContainer}>
              <Image
                source={item.imagen}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            {/* Preparación y botón */}
            <Text style={styles.title}>Preparación</Text>
            <View style={styles.footer}>
              <Text style={styles.time}>30 min</Text>
              <BotonNaranja
                titulo="Editar"
                onPress={() =>
                  console.log("Editar disponibilidad (futuro modal)")
                }
              />
            </View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalDetalle;

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
