import { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SvgUri } from "react-native-svg";
// Default image and no data SVG URLs for fallback
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import LikeButton from "../components/common/LikeButton";
import { BASE_URL } from "../constants/api";

type HealthcareCategoryKey = string;
type HealthcareItem = {
  id: string;
  name: string;
  location: string;
  bookingPay: number;
  bookingCashback: number;
  specialOffers: string[];
  phone: string;
  category: string;
  image?: string;
};

export default function HealthcareScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HealthcareCategoryKey>("All");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<HealthcareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categories = useMemo(() => ["All", ...Array.from(new Set(data.map(h => h.category)))], [data]);

  useEffect(() => {
    const pre = params.preselect as string | undefined;
    if (pre && categories.includes(pre)) {
      setSelectedCategory(pre as HealthcareCategoryKey);
      return;
    }
    if (!pre && categories.length && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0] as HealthcareCategoryKey);
    }
  }, [params.preselect, categories]);

  // Redirect to types tab if entered without a preselected type
  useEffect(() => {
    if (!params.preselect) {
      router.replace({ pathname: '/category-types', params: { category: 'healthcare' } });
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/healthcare`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setData(json as HealthcareItem[]);
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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
    const byCategoryBase = selectedCategory === "All"
      ? data
      : selectedCategory === "Hospitals"
        ? data.filter(h => h.category === "Hospitals" || h.category === "Clinics")
        : data.filter(h => h.category === selectedCategory);
    const byCategory = byCategoryBase;
    if (!query.trim()) return byCategory;
    return byCategory.filter(h => matchesOrdered(query, h.name, h.location));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCategory}</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search hospitals, clinics..."
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustrationWrapper}>
              <SvgUri uri="https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/no-data.svg" width="100%" height="100%" />
            </View>
            <Text style={styles.emptyTitle}>{loading ? 'Loading...' : error ? 'Failed to load' : 'No items found'}</Text>
            <Text style={styles.emptySubtitle}>{loading ? 'Please wait' : error ? error : 'Try a different search query.'}</Text>
          </View>
        )}
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
              router.push({ pathname: '/hospital-detail', params: { id: item.id, image: item.image || '' } });
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={
                  item.image && /^https?:\/\//.test(item.image)
                    ? { uri: item.image }
                    : { uri: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png" }
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.saveRibbon}><Text style={styles.saveText}>{item.category === 'Pharmacy' ? 'Request' : 'Book OP'}</Text></View>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Healthcare',
                  subcategory: item.category,
                  image: item.image,
                  description: item.location,
                  location: item.location,
                  address: item.location,
                  phone: item.phone,
                }}
                style={styles.favoriteButton}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#6b7280" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  {item.specialOffers.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      {item.specialOffers.map((offer: string, i: number) => (
                        <Text key={i} style={styles.offerInline}>• {offer}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                <Text style={{ color: "#6b7280", fontWeight: "700", marginLeft: 4 }}>Tap to book</Text>
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
  headerGradient: { backgroundColor: "#ef4444", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  filterButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", marginLeft: 12 },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
  emptyContainer: { padding: 24, alignItems: "center", justifyContent: "center" },
  emptyIllustrationWrapper: { width: "100%", aspectRatio: 1.2, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", textAlign: "center", marginTop: 4 },
  emptySubtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  image: { width: "100%", height: 160 },
  saveRibbon: { position: "absolute", right: 0, top: 0, backgroundColor: "#10b981", paddingHorizontal: 14, paddingVertical: 8, borderBottomLeftRadius: 14 },
  saveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardBody: { padding: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  offerInline: { fontSize: 12, color: "#374151", marginBottom: 4 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  favoriteButton: { position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
});