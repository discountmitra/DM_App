import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { shoppingData } from "../constants/shoppingData";
import { defaultImage } from "../constants/assets";

export default function ShoppingScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [query, setQuery] = useState("");

  const data = useMemo(() => shoppingData, []);

  const matchesOrdered = (q: string, ...fields: string[]) => {
    const queryStr = q.trim().toLowerCase();
    if (!queryStr) return true;
    const hay = fields.join(" ").toLowerCase();
    const tokens = queryStr.split(/\s+/);
    let pos = 0;
    for (const token of tokens) {
      const idx = hay.indexOf(token, pos);
      if (idx === -1) return false;
      pos = idx + token.length;
    }
    return true;
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    return data.filter(s => matchesOrdered(query, s.name, s.specialist, s.description));
  }, [data, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search shopping services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showScrollTop && y > 300) setShowScrollTop(true);
          if (showScrollTop && y <= 300) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => {
              if (item.id === "cmr-shopping-mall") {
                router.push("/coming-soon");
              } else {
                router.push({ pathname: "/shopping-detail", params: { id: item.id } });
              }
            }}
          >
            <Image
              source={item.image && /^https?:\/\//.test(item.image) ? { uri: item.image } : defaultImage}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>{item.specialist}</Text>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.offerInline} numberOfLines={2}>{item.description}</Text>
              </View>
              <View style={styles.footerRow}>
                <View style={styles.ctaRow}>
                  <Ionicons name="card" size={16} color="#6b7280" />
                  <Text style={styles.ctaText}>Buy Coupon</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (<View style={{ height: 88 }} />)}
      />

      {showScrollTop && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          style={styles.scrollTopFab}
        >
          <Ionicons name="arrow-up" size={20} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerGradient: { backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  image: { width: "100%", height: 160 },
  cardBody: { padding: 16 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 2 },
  offerInline: { fontSize: 12, color: "#374151" },
  footerRow: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ctaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ctaText: { color: "#6b7280", fontWeight: "700" },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});



