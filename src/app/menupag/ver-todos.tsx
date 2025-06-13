import { Link, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DishParams } from "@/features/dish/types";
import { useGetDishes } from "@/features/dish/hooks";
import ModalDetalle from "@/shared/components/modal-detalle";
import { Button } from "@/shared/components/ui/button";
import Header from "@/shared/components/ui/header";
import { DISH_CATEGORIES } from "@/features/dish/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDishSocket } from "@/features/dish/socket";
import { useFocusEffect } from "@react-navigation/native";
const getCategoryValueByLabel = (
  label: string
): DishParams["category"] | undefined => {
  return Object.values(DISH_CATEGORIES).find((cat) => cat.label === label)
    ?.value;
};

const VerTodos = () => {
  const { title, type, esCliente } = useLocalSearchParams();
  console.log("aver los parametors", title, type);
  const titleStr = Array.isArray(title) ? title[0] : title;
  const typeStr = Array.isArray(type) ? type[0] : type;

  function isValidDishType(type: any): type is "FOOD" | "DRINK" {
    return type === "FOOD" || type === "DRINK";
  }

  const esClienteBool = Array.isArray(esCliente)
    ? esCliente[0] === "true"
    : esCliente === "true";

  const categoryMapped = getCategoryValueByLabel(titleStr ?? "");

  const params: DishParams = {
    ...(categoryMapped ? { category: categoryMapped } : {}),
    ...(isValidDishType(typeStr) ? { type: typeStr } : {}),
    ...(esClienteBool ? { isAvailable: true } : {}),
  };

  console.log("Params enviados al hook:", params);

  const {
    data: dishes,
    isLoading,
    error,
    setDishes,
    refetch,
  } = useGetDishes(params);
  useFocusEffect(
    useCallback(() => {
      refetch(); // refetch se ejecuta cuando la pantalla gana foco
    }, [refetch])
  );
  const sampleData = dishes ?? [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof sampleData)[0] | null
  >(null);

  if (!titleStr) {
    return <Text>Cargando...</Text>;
  }

  const { onCreated, onUpdated, onDeleted, cleanup } = createDishSocket();
  useEffect(() => {
    onCreated((newDish) => {
      setDishes((prev) => [...(prev ?? []), newDish]);
    });

    onUpdated((updatedDish) =>
      setDishes((prev = []) =>
        !updatedDish.isAvailable
          ? prev.filter((dish) => dish.id !== updatedDish.id)
          : prev.some((dish) => dish.id === updatedDish.id)
            ? prev.map((dish) =>
                dish.id === updatedDish.id ? updatedDish : dish
              )
            : [...prev, updatedDish]
      )
    );

    onDeleted(({ id }) => {
      setDishes((prev) => (prev ?? []).filter((dish) => dish.id !== id));
    });

    return () => {
      cleanup();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        {/* Botón y Header fijos arriba */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <View className="items-start">
            <Link href=".." asChild>
              <Button title="Atras" />
            </Link>
          </View>
          <Header
            titulo={titleStr}
            mostrarAgregar={false}
            mostrarBusqueda={false}
          />
        </View>

        <ScrollView style={styles.scrollView}>
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
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
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
      </View>
    </SafeAreaView>
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
