import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Colors, FontSizes, Spacing, FontWeights } from "../../theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { deals } from "../../constants/dealsData";

const { width } = Dimensions.get("window");

export default function DealCard() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDealPress = (dealId: number) => {
    switch (dealId) {
      case 1:
        // Navigate to Vishala shopping mall details page
        router.push({
          pathname: "/shopping-detail",
          params: { id: "vishala-shopping-mall" }
        });
        break;
      case 2:
        // Navigate to food tab
        router.push("/food");
        break;
      case 3:
        // Navigate to LULU children's hospital details page
        router.push({
          pathname: "/hospital-detail",
          params: { id: "lulu-children" }
        });
        break;
      case 4:
        // Navigate to Hairzone makeover details page
        router.push({
          pathname: "/salon-detail",
          params: { 
            id: "hair-zone-makeover",
            name: "Hair Zone Makeover",
            address: "Near Gandhi Nagar, Subash Nagar Road, Sircilla",
            rating: "4.8",
            reviews: "234"
          }
        });
        break;
      case 5:
        // Navigate to Ultratech cement details page
        router.push({
          pathname: "/construction-detail",
          params: { 
            constructionId: "ultratech-cement"
          }
        });
        break;
      default:
        router.push("/food");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Hot Deals</Text>
      <Carousel
        loop
        width={width - Spacing.lg}
        height={180}
        autoPlay
        autoPlayInterval={3000}
        data={deals}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleDealPress(item.id)} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      {/* Pagination: Dots before + numbered pill (current/total) + dots after */}
      <View style={styles.paginationWrap}>
        <View style={styles.dotsRow}>
          {Array.from({ length: Math.max(0, activeIndex) }).map((_, i) => (
            <View key={`before-${i}`} style={styles.dot} />
          ))}
          <View style={styles.numberDot}>
            <Text style={styles.numberText}>{activeIndex + 1}/{deals.length}</Text>
          </View>
          {Array.from({ length: Math.max(0, deals.length - (activeIndex + 1)) }).map((_, i) => (
            <View key={`after-${i}`} style={styles.dot} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: FontSizes.subtitle,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    fontFamily: FontWeights.semibold,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  paginationWrap: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterPill: {
    backgroundColor: '#e6f7ef',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  counterText: {
    color: '#15803d',
    fontSize: 12,
    fontFamily: FontWeights.bold,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  numberDot: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 18,
  },
  numberText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: FontWeights.bold,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
  },
  dotActive: {
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
});
