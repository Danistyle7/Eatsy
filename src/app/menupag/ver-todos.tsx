import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import BotonNaranja from "@/shared/components/ui/button";
import Header from "@/shared/components/ui/header";
import { useGetAllDishes } from "@/features/dish/hooks";
import ModalDetalle from "@/shared/components/modal-detalle";

const VerTodos = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const queryResult = useGetAllDishes();
  const sampleData = queryResult.data ?? [];

  // Estado para el modal y el ítem seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!title) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView style={styles.scrollView}>
      {/* Botón Naranja arriba */}
      <BotonNaranja
        titulo="Atras"
        onPress={() => {
          router.back();
          console.log("Volver a la pantalla anterior");
        }}
      />

      <Header titulo={title} mostrarAgregar={false} mostrarBusqueda={false} />

      {/* Lista de platos (cards) */}
      <View style={styles.cardsContainer}>
        {sampleData.map((item, index) => (
          <TouchableOpacity
            key={`${title}-${index}`}
            activeOpacity={0.8}
            style={styles.cardWrapper}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true); // Muestra el modal cuando se presiona un item
            }}
          >
            <View style={styles.cardBox}>
              <Image
                source={item.imageUrl}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Text style={styles.cardPrice}>Bs. {item.price}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ModalDetalle: Se muestra cuando modalVisible es true */}
      {selectedItem && (
        <ModalDetalle
          visible={modalVisible}
          onClose={() => setModalVisible(false)} // Cerrar modal
          item={selectedItem}
        />
      )}
    </ScrollView>
  );
};

// Estilos usando StyleSheet
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%", // Ocupa casi la mitad del ancho disponible
    marginBottom: 16,
  },
  cardBox: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "rgba(66, 68, 90, 1)",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    marginRight: 16, // tailwind mr-4
    padding: 6,
    marginLeft: 16,
    marginBottom: 16,
    borderWidth: 1, // Asegúrate de que el borde tenga un grosor visible
    borderColor: "black", // Asegúrate de que el color del borde esté correcto,
  },
  cardImage: {
    width: "100%",
    height: 120, // Puedes ajustar la altura según tu necesidad
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 6,
  },
  cardHeader: {
    flexDirection: "column",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F2937",
  },
  cardPrice: {
    color: "#EF6C00",
    fontSize: 14,
  },
  cardDescription: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
});

export default VerTodos;
