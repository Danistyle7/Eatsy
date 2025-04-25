import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGetAllDishes } from "@/features/dish/hooks/use-get-dish";

import "@/styles.css";

export default function HomeScreen() {
  const { data: dishes, isLoading } = useGetAllDishes();
  console.log(isLoading, dishes);

  const featuredRecipe = {
    title: "Pasta Carbonara",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop",
    time: "30 min",
    difficulty: "Media",
  };

  const categories = [
    { name: "Italiana", icon: "🍝" },
    { name: "Mexicana", icon: "🌮" },
    { name: "Asiática", icon: "🍜" },
    { name: "Postres", icon: "🍰" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#F7FAFC]">
      <View className="p-5 pt-10">
        <Text className="text-2xl font-bold">¡Bienvenido a Eatsy!</Text>
        <Text className="text-xl mt-5">
          ¡Disfruta de nuestras recetas deliciosas y fáciles de preparar!
        </Text>
      </View>

      <View style={styles.featuredContainer}>
        <Text style={styles.sectionTitle}>Receta Destacada</Text>
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={{ uri: featuredRecipe.image }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>{featuredRecipe.title}</Text>
            <View style={styles.featuredMeta}>
              <Text style={styles.metaText}>⏱ {featuredRecipe.time}</Text>
              <Text style={styles.metaText}>
                📊 {featuredRecipe.difficulty}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredInfo: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  featuredMeta: {
    flexDirection: "row",
    marginTop: 8,
  },
  metaText: {
    color: "#718096",
    marginRight: 15,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: "#2D3748",
    fontWeight: "500",
  },
});
