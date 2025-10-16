import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteItem {
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
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoritesByCategory: (category: string) => FavoriteItem[];
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = '@favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to storage whenever favorites change
  useEffect(() => {
    saveFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: Date.now(),
    };
    
    setFavorites(prev => {
      // Check if item already exists
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, favoriteItem];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const getFavoritesByCategory = (category: string) => {
    return favorites.filter(item => item.category === category);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByCategory,
    clearAllFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
