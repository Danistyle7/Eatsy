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
import { DishParams } from "@/features/dish/types";

const VerTodos = () => {
  const router = useRouter();
  const { title, type, esCliente } = useLocalSearchParams();
  const titleStr = Array.isArray(title) ? title[0] : title;
  const typeStr = Array.isArray(type) ? type[0] : type;

  // Ahora armamos los params
  const esClienteBool = Array.isArray(esCliente)
    ? esCliente[0] === "true"
    : esCliente === "true";

  const params: DishParams = {
    category: titleStr as DishParams["category"],
    type: typeStr,
    ...(esClienteBool ? { isAvailable: true } : {}),
  };

  const { data: dishes, isLoading, error } = useGetAllDishes(params);

  const sampleData = dishes ?? [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof sampleData)[0] | null
  >(null);

  if (!titleStr) {
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

      <Header
        titulo={titleStr}
        mostrarAgregar={false}
        mostrarBusqueda={false}
      />

      {/* Lista de platos (cards) */}
      <View style={styles.cardsContainer}>
        {sampleData.map((item, index) => (
          <TouchableOpacity
            key={`${titleStr}-${index}`}
            activeOpacity={0.8}
            style={styles.cardWrapper}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <View style={styles.cardBox}>
              <Image
                source={{ uri: item.imageUrl }}
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
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ModalDetalle */}
      {selectedItem && (
        <ModalDetalle
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
          modoCliente={esClienteBool}
        />
      )}
    </ScrollView>
  );
};

// Estilos
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
    width: "48%",
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
    marginRight: 16,
    padding: 6,
    marginLeft: 16,
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 120,
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
