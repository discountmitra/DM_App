import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { Spacing, FontSizes, FontWeights } from "../../theme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color?: string;
  onPress?: () => void;
  comingSoon?: boolean;
};

export default function CategoryCard({ icon, title, color = "#4A90E2", onPress, comingSoon = false }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[`${color}40`, `${color}1A`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {comingSoon && (
          <View style={styles.comingSoonBadge}>
            <Ionicons name="time" size={12} color="#fff" />
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.sm - 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",

    // Enhanced Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,

    // Enhanced Elevation for Android
    elevation: 5,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.small,
    textAlign: "center",
    color: "#1f2937",
    letterSpacing: 0.2,
    fontFamily: FontWeights.medium,
  },
  comingSoonBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonText: {
    color: "#fff",
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: FontWeights.semibold,
  },
});
