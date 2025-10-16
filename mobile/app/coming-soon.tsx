import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { soonSvgUrl } from "../constants/assets";

function ComingSoonScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coming Soon</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <SvgUri uri={soonSvgUrl} width="100%" height="100%" />
        </View>
        <Text style={styles.title}>We're preparing something great</Text>
        <Text style={styles.subtitle}>This will be available soon. Stay tuned!</Text>

        <TouchableOpacity activeOpacity={0.9} style={styles.notifyBtn}>
          <Ionicons name="notifications" size={16} color="#fff" />
          <Text style={styles.notifyText}>Notify Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ComingSoonScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#111827", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16, flexDirection: "row", alignItems: "center" },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  content: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  illustrationWrapper: { width: "100%", aspectRatio: 1.1, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a", textAlign: "center", marginTop: 4 },
  subtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 8 },
  notifyBtn: { marginTop: 16, backgroundColor: "#111827", paddingHorizontal: 16, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  notifyText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
});


