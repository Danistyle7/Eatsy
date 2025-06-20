import { router } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
const Section = ({
  title,
  data,
  setModalVisible,
  setSelectedItem,
  esCliente,
}) => (
  <View style={styles.sectionBox}>
    <View style={styles.sectionHeader}>
      <Text className="text-2xl font-bold">{title}</Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/menupag/ver-todos", // ruta a donde quieres ir

            params: { title, esCliente, type: data[0]?.type }, // los parámetros que quieres enviar
          })
        }
      >
        <Text style={{ color: "orange", fontSize: 16 }}>Ver todos &gt;</Text>
      </TouchableOpacity>
    </View>

    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item, index) => `${title}-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            console.log("Item tocado en sección:", title, item.name);
            setSelectedItem(item);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.cardBox}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              // resizeMode="cover"
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
      )}
    />

    {/* <ModalDetalle
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      item={selectedItem}
      modoCliente={esCliente}
    /> */}
  </View>
);

const styles = {
  cardBox: {
    width: 144, // tailwind w-36
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 16, // tailwind mr-4
    padding: 6,
    marginLeft: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "rgba(66, 68, 90, 1)",
    shadowOffset: { width: -10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 80, // como tailwind h-20
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 8,
  },
  cardHeader: {
    flexDirection: "column",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#1F2937", // tailwind text-gray-800
    flex: 1,
  },
  cardPrice: {
    color: "#EF6C00", // tailwind text-orange-600
    fontSize: 13,
    marginLeft: 5,
  },
  cardDescription: {
    color: "#6B7280", // tailwind text-gray-500
    fontSize: 12,
    marginTop: 4,
  },
  sectionBox: {
    backgroundColor: "white",
    borderRadius: 16,

    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
};

export default Section;
