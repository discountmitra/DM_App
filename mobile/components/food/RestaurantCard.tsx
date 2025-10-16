import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from '../common/LikeButton';
import { FontSizes, FontWeights } from '../../theme';

type Restaurant = {
  id: string;
  name: string;
  specialist: string[];
  rating: number;
  reviews: number;
  distance: string;
  area: string;
  openTime: string;
  savePercent?: number;
};

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <View style={styles.card}>
      {/* Image section with like button - completely separate from navigation */}
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/default.png")} style={styles.image} resizeMode="cover" />
        {typeof restaurant.savePercent === "number" && (
          <View style={styles.saveRibbon}>
            <Text style={styles.saveText}>Save</Text>
            <Text style={styles.savePercent}>{restaurant.savePercent}%</Text>
          </View>
        )}
        
        {/* Like button with explicit positioning and touch handling */}
        <View style={styles.likeButtonContainer}>
        <LikeButton 
          item={{
            id: restaurant.id,
            name: restaurant.name,
            category: 'Food',
            subcategory: restaurant.specialist.join(", "),
            image: require("../../assets/default.png"),
            description: restaurant.specialist.join(", "),
            rating: restaurant.rating,
            reviews: restaurant.reviews,
            location: restaurant.area,
            address: restaurant.area,
          }}
          style={styles.favoriteButton}
        />
        </View>
      </View>

      {/* Card body - only this area is touchable for navigation */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={styles.cardBody} 
        onPress={onPress}
      >
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.subtitle}>{restaurant.specialist.join(", ")}</Text>
            <View style={styles.ratingStarsRow}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Ionicons
                  key={idx}
                  name={idx < Math.floor(restaurant.rating) ? "star" : idx < restaurant.rating ? "star-half" : "star-outline"}
                  size={14}
                  color="#f59e0b"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.subtitle}>{restaurant.distance}, {restaurant.area}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.openLabel}>Open: <Text style={styles.openTime}>{restaurant.openTime}</Text></Text>
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>Tap to view details & dine out</Text>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  likeButtonContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1000,
  },
  image: {
    width: "100%",
    height: 180,
  },
  homeDeliveryPill: {
    position: "absolute",
    left: 12,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
  },
  homeDeliveryText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#111827",
    textTransform: "lowercase",
    fontFamily: FontWeights.semibold,
  },
  saveRibbon: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 14,
  },
  saveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  savePercent: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: FontSizes.subtitle,
    color: "#111827",
    fontFamily: FontWeights.semibold,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 2,
  },
  ratingStarsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#111827",
    fontFamily: FontWeights.semibold,
  },
  reviewsText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  openLabel: {
    fontSize: 12,
    color: "#374151",
  },
  openTime: {
    color: "#16a34a",
    fontWeight: "600",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaText: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 4,
  },
});


