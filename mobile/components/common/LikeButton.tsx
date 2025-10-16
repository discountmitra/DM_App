import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const isLiked = isFavorite(item.id);

  const handlePress = () => {
    if (isLiked) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
    onPress?.();
  };

  return (
    <TouchableOpacity 
      style={[styles.likeButton, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
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
});
