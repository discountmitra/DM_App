import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../contexts/FavoritesContext";
import LikeButton from "../components/common/LikeButton";
import { defaultImage } from "../constants/assets";

type SortOption = 'all' | 'Food' | 'Healthcare' | 'Home Services' | 'Beauty' | 'Events' | 'Construction' | 'Shopping';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, removeFromFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('all');

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'Food', label: 'Food' },
    { key: 'Healthcare', label: 'Healthcare' },
    { key: 'Home Services', label: 'Home Services' },
    { key: 'Beauty', label: 'Beauty' },
    { key: 'Events', label: 'Events' },
    { key: 'Construction', label: 'Construction' },
    { key: 'Shopping', label: 'Shopping' },
  ];

  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    // Filter by category
    if (sortBy !== 'all') {
      filtered = filtered.filter(item => item.category === sortBy);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.subcategory?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [favorites, sortBy, searchQuery]);

  const handleItemPress = (item: any) => {
    // Navigate to appropriate detail page based on category
    switch (item.category) {
      case 'Food':
        router.push({ pathname: "/restaurant-detail", params: { id: item.id } });
        break;
      case 'Healthcare':
        router.push({ pathname: "/hospital-detail", params: { id: item.id, image: item.image || "" } });
        break;
      case 'Home Services':
        router.push({ pathname: "/home-service-detail", params: { id: item.id, name: item.name, desc: item.description, category: item.subcategory, price: item.price, discount: "10%", image: item.image || "" } });
        break;
      case 'Beauty':
        router.push({ pathname: "/salon-detail", params: { id: item.id, name: item.name, address: item.address, rating: item.rating?.toString() || "4.8", reviews: item.reviews?.toString() || "234", image: item.image || "" } });
        break;
      case 'Events':
        const eventId = item.name.toLowerCase().replace(/\s+/g, '-');
        router.push({ pathname: "/event-detail", params: { eventId, image: item.image || "" } });
        break;
      case 'Construction':
        const constructionId = item.name.toLowerCase().replace(/\s+/g, '-');
        router.push({ pathname: "/construction-detail", params: { constructionId, image: item.image || "" } });
        break;
      default:
        break;
    }
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.favoriteCard} 
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={
            item.image && /^https?:\/\//.test(item.image)
              ? { uri: item.image }
              : defaultImage
          }
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <LikeButton 
          item={item}
          style={styles.favoriteButton}
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || item.subcategory || "No description available"}
        </Text>
        
        <View style={styles.itemMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.ratingText}>{item.rating?.toFixed(1) || "4.8"}</Text>
            <Text style={styles.reviewsText}>({item.reviews || "234"})</Text>
          </View>
          
          {item.price && (
            <Text style={styles.priceText}>{item.price}</Text>
          )}
        </View>
        
        {item.subcategory && (
          <View style={styles.subcategoryContainer}>
            <Ionicons name="pricetag" size={12} color="#6b7280" />
            <Text style={styles.subcategoryText}>{item.subcategory}</Text>
          </View>
        )}
        
        {item.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={12} color="#6b7280" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        
        {item.address && item.address !== item.location && (
          <View style={styles.addressContainer}>
            <Ionicons name="home" size={12} color="#6b7280" />
            <Text style={styles.addressText}>{item.address}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={64} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        {sortBy === 'all' 
          ? "Start exploring and add items to your favorites!"
          : `No ${sortBy.toLowerCase()} items in your favorites yet.`
        }
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.exploreButtonText}>Explore Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search favorites..."
            placeholderTextColor="#6b7280"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <FlatList
          data={sortOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sortChip,
                sortBy === item.key && styles.sortChipActive
              ]}
              onPress={() => setSortBy(item.key)}
            >
              <Text style={[
                styles.sortChipText,
                sortBy === item.key && styles.sortChipTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>

      {/* Favorites Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'items'}
          {sortBy !== 'all' && ` in ${sortBy}`}
        </Text>
      </View>

      {/* Favorites List */}
      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  sortContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sortList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sortChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  sortChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  sortChipTextActive: {
    color: "#fff",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  countText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  favoriteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  cardImageContainer: {
    position: "relative",
    height: 160,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    padding: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  subcategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  subcategoryText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    flex: 1,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
