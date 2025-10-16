import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MenuItem = {
  item: string;
  price: number | { half: number; full: number };
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  quantity?: number;
  isVeg?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
}

export default function MenuItemCard({ 
  item, 
  onAddToCart, 
  onRemoveFromCart, 
  quantity = 0,
  isVeg = true,
  isBestseller = false,
  rating = 4.6,
  reviewCount = 164
}: MenuItemCardProps) {
  const price = typeof item.price === 'number' ? item.price : item.price.full;
  const discountedPrice = Math.floor(price * 0.7); // 30% discount

  return (
    <View style={styles.menuItemCard}>
      <Image source={require("../../assets/default.png")} style={styles.menuItemImage} />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <View style={[styles.vegIndicator, !isVeg && styles.nonVegIndicator]} />
          {isBestseller && (
            <Text style={styles.bestsellerBadge}>Bestseller</Text>
          )}
        </View>
        <Text style={styles.menuItemName}>{item.item}</Text>
        <View style={styles.menuItemRating}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={styles.menuItemRatingText}>{rating} ({reviewCount})</Text>
        </View>
        <View style={styles.menuItemPrice}>
          <Text style={styles.originalPrice}>₹{price}</Text>
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
        </View>
        
        {quantity > 0 ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={onRemoveFromCart}>
              <Ionicons name="remove" size={16} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onAddToCart}>
              <Ionicons name="add" size={16} color="#111827" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItemCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuItemImage: {
    width: "100%",
    height: 100,
  },
  menuItemContent: {
    padding: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  vegIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
  },
  nonVegIndicator: {
    backgroundColor: "#ef4444",
  },
  bestsellerBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  menuItemRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemRatingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  menuItemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#111827",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});


