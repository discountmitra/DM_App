import { useMemo, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Alert, Animated, Modal, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { restaurantData, Restaurant } from "../constants/restaurantData";
import LikeButton from "../components/common/LikeButton";
import { reviews } from "../constants/reviewsData";
import { getAvatarColor } from "../constants/reviewsData";
import { defaultImage } from "../constants/assets";

export default function RestaurantDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const headerImage = typeof params.image === 'string' ? (params.image as string) : '';
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [viewerData, setViewerData] = useState<GalleryImage[]>([]);
  const [currentViewerIndex, setCurrentViewerIndex] = useState(0);
  const viewerListRef = useRef<FlatList<any>>(null);

  type GalleryImage = { id: number; url: string };

  // Get restaurant data from params or use first restaurant as default
  const restaurant: Restaurant = useMemo(() => {
    const restaurantId = params.restaurantId as string;
    return restaurantData.find(r => r.id === restaurantId) || restaurantData[0];
  }, [params.restaurantId]);

  const handleDineOut = () => {
    router.push({
      pathname: '/dine-out',
      params: { restaurantId: restaurant.id }
    });
  };

  const handleTakeAway = () => {
    router.push('/coming-soon');
  };

  const handleCall = async () => {
    const number = (restaurant.phone || '').replace(/\s+/g, '');
    if (!number) return;
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
  };

  const handleDirections = () => {
    const address = `${restaurant.area}, ${restaurant.distance}`;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps');
    });
  };


  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
  };

  const galleryImages: GalleryImage[] = useMemo(() => {
    const photos = Array.isArray(restaurant.photos) ? restaurant.photos : [];
    if (photos.length > 0) {
      return photos.map((url, index) => ({ id: index + 1, url }));
    }
    // Fallback to header image if provided
    if (headerImage && /^https?:\/\//.test(headerImage)) {
      return [{ id: 1, url: headerImage }];
    }
    return [];
  }, [restaurant.photos, headerImage]);

  const filteredImages = galleryImages;

  const openImageViewer = (indexInFiltered: number) => {
    const dataForViewer = filteredImages;
    setViewerData(dataForViewer);
    setViewerStartIndex(indexInFiltered);
    setCurrentViewerIndex(indexInFiltered);
    setIsViewerVisible(true);
    // Defer scroll to ensure list rendered
    requestAnimationFrame(() => {
      if (viewerListRef.current && indexInFiltered > 0) {
        viewerListRef.current.scrollToIndex({ index: indexInFiltered, animated: false });
      }
    });
  };

  const getItemLayout = (_: any, index: number) => {
    const { width } = Dimensions.get('window');
    return { length: width, offset: width * index, index };
  };

  // reviews imported at top from constants

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <View style={styles.stickyHeaderContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.stickyHeaderInfo}>
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{restaurant.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>⭐ {restaurant.rating.toFixed(1)}</Text>
                <Text style={styles.stickyHeaderPrice}>{restaurant.priceForTwo}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#111827" />
              </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <Image 
            source={headerImage && /^https?:\/\//.test(headerImage) ? { uri: headerImage } : defaultImage} 
            style={styles.heroBackgroundImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          
          {/* Top Action Buttons */}
          <View style={styles.heroTopActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.heroBackButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.heroRightActions}>
              <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#111827" />
              </TouchableOpacity>
              <LikeButton 
                item={{
                  id: restaurant.id,
                  name: restaurant.name,
                  category: 'Food',
                  subcategory: restaurant.specialist.join(", "),
                  image: headerImage,
                  description: restaurant.specialist.join(", "),
                  rating: restaurant.rating,
                  reviews: restaurant.reviews,
                  location: restaurant.area,
                  address: restaurant.area,
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              />
            </View>
          </View>
        </View>
          
        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Restaurant Info Card */}
          <View style={styles.restaurantInfoCard}>
            <View style={styles.restaurantInfoHeader}>
              <View style={styles.restaurantIcon}>
                <Ionicons name="restaurant" size={24} color="#f97316" />
              </View>
              <View style={styles.restaurantInfoMain}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantLocation}>
                  <Ionicons name="location" size={12} color="#ef4444" />
                  <Text style={styles.restaurantLocationText}>{restaurant.area}, {restaurant.distance}</Text>
                </View>
                <View style={styles.restaurantMeta}>
                  <Text style={styles.restaurantPrice}>{restaurant.priceForTwo}</Text>
                  <View style={styles.restaurantStatus}>
                    <Text style={styles.restaurantStatusText}>{restaurant.opensIn}</Text>
                    <Ionicons name="chevron-down" size={14} color="#6b7280" />
                  </View>
                </View>
                <View style={styles.restaurantRating}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
                  </View>
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>Budget Eats</Text>
                  </View>
                </View>
                <View style={styles.purchaseHistory}>
                  <Ionicons name="flash" size={12} color="#10b981" />
                  <Text style={styles.purchaseText}>Bought 25 days ago</Text>
                  <Text style={styles.purchaseCount}>929 bought</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Service Options */}
          <View style={styles.serviceOptions}>
            <TouchableOpacity 
              style={styles.serviceOption}
              onPress={handleDineOut}
            >
              <View style={styles.serviceOptionIcon}>
                <Ionicons name="restaurant" size={24} color="#f97316" />
              </View>
              <Text style={styles.serviceOptionText}>Dine Out</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.serviceOption}
              onPress={handleTakeAway}
            >
              <View style={styles.serviceOptionIcon}>
                <Ionicons name="bicycle" size={24} color="#10b981" />
              </View>
              <Text style={styles.serviceOptionText}>Delivery</Text>
              <View style={styles.comingSoonBadge}>
                <Ionicons name="time" size={10} color="#fff" />
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Gallery Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryImages}>
              {filteredImages.map((image, idx) => (
                <TouchableOpacity key={image.id} activeOpacity={0.8} onPress={() => openImageViewer(idx)}>
                  <Image 
                    source={{ uri: image.url }} 
                    style={styles.galleryImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <View style={styles.addressHeader}>
              <Text style={styles.sectionTitle}>Address</Text>
              <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
                <Ionicons name="map" size={16} color="#2563eb" />
                <Text style={styles.directionsText}>Maps</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.addressText}>{restaurant.area}, {restaurant.distance}</Text>
            <View style={styles.mapContainer}>
              <Image 
                source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=15&size=400x200&maptype=roadmap&markers=color:red%7C40.714728,-73.998672&key=YOUR_API_KEY' }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                <Ionicons name="location" size={24} color="#ef4444" />
              </View>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating & Reviews</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingMain}>
                <Text style={styles.ratingNumber}>{restaurant.rating.toFixed(1)}/5</Text>
                <View style={styles.ratingStarsContainer}>
                  <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
                  <Text style={styles.ratingSubtext}>{restaurant.reviews} reviews</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.reviewsScroll}
              decelerationRate="fast"
              snapToInterval={292}
              snapToAlignment="start"
              contentContainerStyle={styles.reviewsScrollContent}
              pagingEnabled={false}
            >
              {reviews.map((review, index) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, { backgroundColor: getAvatarColor(review.name) }]}>
                      <Text style={styles.reviewInitial}>{review.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <Text style={styles.reviewRating}>⭐ {review.rating}.0</Text>
                  </View>
                  <Text style={styles.reviewComment} numberOfLines={3}>{review.comment}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      {/* Fullscreen Image Viewer */}
      <Modal
        visible={isViewerVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsViewerVisible(false)}
      >
        <SafeAreaView style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <TouchableOpacity style={styles.viewerBackButton} onPress={() => setIsViewerVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.viewerTitleWrap}>
              <Text style={styles.viewerTitle} numberOfLines={1}>Gallery</Text>
              <Text style={styles.viewerCounter}>
                {currentViewerIndex + 1} / {viewerData.length}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            ref={viewerListRef}
            data={viewerData}
            keyExtractor={(item) => String(item.id)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={viewerStartIndex}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={(e) => {
              const { width } = Dimensions.get('window');
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentViewerIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.viewerSlide}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.viewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <View style={styles.viewerCaptionWrap}>
              <Text style={styles.viewerCaption} numberOfLines={1}>Photo</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  stickyHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  stickyHeaderInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  stickyHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stickyHeaderDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  stickyHeaderRating: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 12,
  },
  stickyHeaderPrice: {
    fontSize: 12,
    color: "#6b7280",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: "relative",
    overflow: "hidden",
  },
  heroBackgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroTopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 10,
  },
  heroRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLikeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginTop: -25,
  },
  restaurantInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  restaurantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInfoMain: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  restaurantLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantLocationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  restaurantPrice: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  restaurantStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restaurantStatusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  restaurantRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  reviewsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  budgetTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budgetTagText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  purchaseHistory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  purchaseText: {
    fontSize: 12,
    color: "#6b7280",
  },
  purchaseCount: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 4,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  mainContent: {
    backgroundColor: "#f8fafc",
    marginTop: -100, // Overlap with hero section
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 5,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  serviceOptions: {
    flexDirection: "row",
    gap: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  serviceOption: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  serviceOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  serviceOptionSubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  galleryTabs: {
    marginBottom: 16,
  },
  galleryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f8fafc",
  },
  galleryTabActive: {
    backgroundColor: "#2563eb",
  },
  galleryTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  galleryTabTextActive: {
    color: "#fff",
  },
  galleryImages: {
    marginTop: 8,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  viewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  viewerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "center",
  },
  viewerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  viewerCounter: {
    color: "#d1d5db",
    fontSize: 12,
    marginTop: 2,
  },
  viewerSlide: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewerImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 200,
  },
  viewerCaptionWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  viewerCaption: {
    color: "#fff",
    fontSize: 14,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  directionsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563eb",
    marginLeft: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  callText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 6,
  },
  ratingContainer: {
    paddingVertical: 16,
  },
  ratingMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },
  ratingStarsContainer: {
    alignItems: "flex-end",
  },
  ratingStars: {
    fontSize: 18,
    marginBottom: 4,
  },
  ratingSubtext: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  reviewsScroll: {
    marginTop: 8,
  },
  reviewsScrollContent: {
    paddingRight: 16,
  },
  reviewCard: {
    width: 280,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewInitial: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  reviewComment: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  likeButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  mapContainer: {
    position: "relative",
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    height: 120,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
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
    fontWeight: "600",
  },
});