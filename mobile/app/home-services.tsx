import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SvgUri } from "react-native-svg";
import { noDataSvgUrl } from "../constants/assets";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import LikeButton from "../components/common/LikeButton";
import { homeServicesData, homeServiceCategories, HomeServiceCategoryKey } from "../constants/homeServicesData";
import { defaultImage } from "../constants/assets";

export default function HomeServicesScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HomeServiceCategoryKey>("Repairs & Maintenance");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const pre = params.preselect as string | undefined;
    if (pre && homeServiceCategories.includes(pre as any)) {
      setSelectedCategory(pre as any);
    }
  }, [params.preselect]);

  // Redirect to types tab if no type preselected
  useEffect(() => {
    if (!params.preselect) {
      router.replace({ pathname: '/category-types', params: { category: 'home-services' } });
    }
  }, []);

  const data = useMemo<Service[]>(
    () => [
      // Repairs & Maintenance
      {
        id: "plumber-services",
        name: "Plumber Services",
        description: "Water Leakage, Pipe Installation, Faucet Repair",
        category: "Repairs & Maintenance",
        icon: "water",
        price: "₹299",
        discount: "Save 20%",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1683141410787-c4dbd2220487?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D",
        normalUserOffer: "Service call: ₹200\nPipe repair: 10% off\nEmergency service: ₹300\nWarranty: 30 days",
        vipUserOffer: "Free service call\nPremium repair: 25% off\nPriority emergency: Free\nExtended warranty: 90 days\nFree maintenance check",
      },
      {
        id: "electrician-services",
        name: "Electrician Services", 
        description: "Wiring, Appliance Repair, Switch Installation",
        category: "Repairs & Maintenance",
        icon: "flash",
        price: "₹399",
        discount: "Save 15%",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D",
        normalUserOffer: "Service call: ₹250\nWiring repair: 15% off\nAppliance repair: 10% off\nWarranty: 45 days",
        vipUserOffer: "Free service call\nPremium wiring: 30% off\nPriority appliance repair: 20% off\nExtended warranty: 120 days\nFree safety inspection",
      },
      {
        id: "ac-fridge-repair",
        name: "AC & Fridge Repair",
        description: "Cooling System Maintenance, Gas Refill",
        category: "Repairs & Maintenance",
        icon: "snow",
        price: "₹599",
        discount: "Save 25%",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D",
        normalUserOffer: "Service call: ₹300\nGas refill: 20% off\nAC cleaning: ₹500\nWarranty: 60 days",
        vipUserOffer: "Free service call\nPremium gas refill: 35% off\nFree AC cleaning\nExtended warranty: 180 days\nFree seasonal maintenance",
      },
      {
        id: "ro-water-purifier",
        name: "RO Water Purifier Repair",
        description: "Water Filtration System, Filter Replacement",
        category: "Repairs & Maintenance",
        icon: "water",
        price: "₹199",
        discount: "Save 30%",
        rating: 4.5,
        reviews: 650,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1662647343354-5a03bbbd1d45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Uk8lMjB3YXRlciUyMHB1cmlmaWVyfGVufDB8fDB8fHww",
      },
      {
        id: "tv-installation",
        name: "TV Installation & Repair",
        description: "Entertainment System Setup, Wall Mounting",
        category: "Repairs & Maintenance",
        icon: "tv",
        price: "₹499",
        discount: "Save 18%",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1723701630582-b2d418fd7e4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFRWJTIwcmVhcGFpcnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: "washing-machine-repair",
        name: "Washing Machine Repair",
        description: "Laundry Appliance Service, Motor Repair",
        category: "Repairs & Maintenance",
        icon: "shirt",
        price: "₹399",
        discount: "Save 22%",
        rating: 4.6,
        reviews: 720,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V2FzaGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: "microwave-oven-repair",
        name: "Microwave & Oven Repair",
        description: "Kitchen Appliance Service, Heating Element",
        category: "Repairs & Maintenance",
        icon: "restaurant",
        price: "₹299",
        discount: "Save 25%",
        rating: 4.5,
        reviews: 580,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1565357253897-79d691886a73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T3ZlbnxlbnwwfHwwfHx8MA%3D%3D",
      },

      // Cleaning & Pest Control
      {
        id: "home-deep-cleaning",
        name: "Home Deep Cleaning",
        description: "Complete House Sanitization, Deep Scrub",
        category: "Cleaning & Pest Control",
        icon: "sparkles",
        price: "₹1299",
        discount: "Save 35%",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SG9tZSUyMGNsZWFuaW5nfGVufDB8fDB8fHww",
      },
      {
        id: "sofa-carpet-cleaning",
        name: "Sofa & Carpet Cleaning",
        description: "Upholstery Deep Clean, Stain Removal",
        category: "Cleaning & Pest Control",
        icon: "home",
        price: "₹899",
        discount: "Save 28%",
        rating: 4.7,
        reviews: 950,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1677683510968-718b68269897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8SG9tZSUyMGNsZWFuaW5nfGVufDB8fDB8fHww",
      },
      {
        id: "pest-control",
        name: "Pest Control",
        description: "Cockroaches, Termites, Mosquitoes Control",
        category: "Cleaning & Pest Control",
        icon: "bug",
        price: "₹999",
        discount: "Save 30%",
        rating: 4.8,
        reviews: 1300,
        availability: "Available Now",
        image: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVzdCUyMGNvbnRyb2x8ZW58MHx8MHx8fDA%3D",
      },

      // Security & Surveillance
      {
        id: "cctv-installation",
        name: "CCTV Installation & Maintenance",
        description: "Security Camera Systems, 24/7 Monitoring",
        category: "Security & Surveillance",
        icon: "videocam",
        price: "₹1999",
        discount: "Save 30%",
        rating: 4.9,
        reviews: 1800,
        availability: "Available Now",
        image: "https://plus.unsplash.com/premium_photo-1675016457613-2291390d1bf6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q0NUVnxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
    []
  );

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
    const byCategory = data.filter(s => s.category === selectedCategory);
    if (!query.trim()) return byCategory;
    return byCategory.filter(s => matchesOrdered(query, s.name, s.description));
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
              placeholder="Search services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
      </View>

      {/* Category chips outside of the header */}
      {/* Types are now shown in a dedicated tab; horizontal chips removed */}

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustrationWrapper}>
              <SvgUri uri={noDataSvgUrl} width="100%" height="100%" />
            </View>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>Try a different search query.</Text>
          </View>
        )}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showScrollTop && y > 300) setShowScrollTop(true);
          if (showScrollTop && y <= 300) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push({ pathname: "/home-service-detail", params: { id: item.id, name: item.name, desc: item.description, category: item.category, price: item.price, discount: item.discount, image: item.image || "", normalUserOffer: item.normalUserOffer || "", vipUserOffer: item.vipUserOffer || "" } })}>
            <View style={{ position: "relative" }}>
              <Image
                source={
                  item.image && /^https?:\/\//.test(item.image)
                    ? { uri: item.image }
                    : defaultImage
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.discountRibbon}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Home Services',
                  subcategory: item.category,
                  image: item.image,
                  description: item.description,
                  price: item.price,
                  rating: item.rating,
                  reviews: item.reviews,
                }}
                style={styles.favoriteButton}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.descriptionRow}>
                    <Ionicons name={item.icon} size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingStars}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Ionicons
                          key={idx}
                          name={idx < Math.floor(item.rating) ? "star" : idx < item.rating ? "star-half" : "star-outline"}
                          size={12}
                          color="#f59e0b"
                          style={{ marginRight: 1 }}
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewsText}>({item.reviews})</Text>
                  </View>
                </View>
              </View>

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>{item.availability}</Text>
              </View>

              <View style={styles.actionsRow}>
                <View style={{ flex: 1 }} />
                <View style={styles.linkContainer}>
                  <Text style={styles.linkText}>View & book services</Text>
                  <Ionicons name="arrow-forward" size={16} color="grey" style={{ marginLeft: 6 }} />
                </View>
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
  headerGradient: { backgroundColor: "#3b82f6", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  filterButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", marginLeft: 12 },
  categoryChipsContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  categoryChipsOuter: { paddingHorizontal: 16, paddingVertical: 12 },
  catChip: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#ffffff", paddingHorizontal: 14, height: 40, borderRadius: 20, marginRight: 12, alignItems: "center", justifyContent: "center" },
  catChipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  catChipText: { fontWeight: "700", color: "#111827", fontSize: 12 },
  catChipTextActive: { color: "#ffffff" },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
  emptyContainer: { padding: 24, alignItems: "center", justifyContent: "center" },
  emptyIllustrationWrapper: { width: "100%", aspectRatio: 1.2, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", textAlign: "center", marginTop: 4 },
  emptySubtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  image: { width: "100%", height: 160 },
  discountRibbon: { position: "absolute", right: 0, top: 0, backgroundColor: "#ef4444", paddingHorizontal: 14, paddingVertical: 8, borderBottomLeftRadius: 14 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardBody: { padding: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  descriptionRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  descriptionText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  availabilityRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
  favoriteButton: { position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  linkContainer: { flexDirection: "row", alignItems: "center" },
  linkText: { color: "grey", fontWeight: "700" },
});
