import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTopBar() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          placeholder='Search "Ice Cream"'
          style={styles.input}
          placeholderTextColor="#777"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: "transparent",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
