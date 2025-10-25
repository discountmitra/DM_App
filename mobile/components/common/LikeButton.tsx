import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../contexts/FavoritesContext';

interface LikeButtonProps {
  item: {
    id: string;
    name: string;
    category: string;
    subcategory?: string;
    image?: string;
    description?: string;
    price?: string;
    rating?: number;
    reviews?: number;
    location?: string;
    address?: string;
    phone?: string;
  };
  size?: number;
  style?: any;
  onPress?: () => void;
}

export default function LikeButton({ item, size = 18, style, onPress }: LikeButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites, loading } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isLiked = isFavorite(item.id);

  const handlePress = async () => {
    if (isProcessing || loading) return;
    
    setIsProcessing(true);
    try {
      if (isLiked) {
        await removeFromFavorites(item.id);
      } else {
        await addToFavorites({
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          subcategory: item.subcategory,
          image: item.image,
          description: item.description,
          price: item.price,
          rating: item.rating,
          reviews: item.reviews,
          location: item.location,
          address: item.address,
          phone: item.phone,
        });
      }
      onPress?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update favorites'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.likeButton, style, (isProcessing || loading) && styles.disabled]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isProcessing || loading}
    >
      <Ionicons 
        name={isLiked ? "heart" : "heart-outline"} 
        size={size} 
        color={isLiked ? "#ef4444" : "#ef4444"} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
