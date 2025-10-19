import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { BASE_URL } from "../constants/api";

function ComingSoonScreen() {
  const navigation = useNavigation();
  const [soonSvgUrl, setSoonSvgUrl] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/assets/type/soon_svg`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive && json.length > 0) setSoonSvgUrl(json[0].image);
      } catch (e: any) {
        // Fallback to default SVG if loading fails
        if (alive) setSoonSvgUrl("https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/soon.svg");
      }
    })();
    return () => { alive = false; };
  }, []);

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
          {soonSvgUrl ? <SvgUri uri={soonSvgUrl} width="100%" height="100%" /> : null}
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


