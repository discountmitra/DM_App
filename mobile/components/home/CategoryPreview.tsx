import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import CategoryCard from "./CategoryCard";
import { categoryImages } from "../../constants/assets";
import { Spacing, FontSizes, Colors } from "../../theme";

const categories = [
  { id: "1", title: "Food", subtitle: "Restaurants & Dine Out", icon: "fast-food", color: "#FF6B6B" },
  { id: "2", title: "Healthcare", subtitle: "Hospitals & Clinics", icon: "medkit", color: "#4ECDC4" },
  { id: "4", title: "Home Services", subtitle: "Repair & Maintenance", icon: "build", color: "#FFA502" },
  { id: "8", title: "Events", subtitle: "Event Management", icon: "calendar", color: "#E91E63" },
  { id: "6", title: "Beauty & Salon", subtitle: "Hair & Beauty Care", icon: "color-palette", color: "#B53471" },
];

export default function CategoriesPreview() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📂 Categories</Text>

      <FlatList
        data={categories.slice(0, 4)} // show only 4 on home
        renderItem={({ item }) => {
          const handlePress = () => {
            if (item.title === "Food") {
              router.push("/food");
            } else if (item.title === "Healthcare") {
              router.push("/healthcare");
            } else if (item.title === "Home Services") {
              router.push("/home-services");
            } else if (item.title === "Events") {
              router.push("/events");
            } else {
              router.push("/coming-soon");
            }
          };

          return (
            <CategoryCard
              title={item.title}
              color={item.color}
              onPress={handlePress}
              imageSource={categoryImages[item.title]}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/categories")}
      >
        <Text style={styles.buttonText}>View More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: FontSizes.small,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  button: {
    marginTop: Spacing.md,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: FontSizes.button,
  },
});
