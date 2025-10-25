import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import favoritesService, { FavoriteItem } from '../services/favoritesService';
import { useAuth } from './AuthContext';

// Re-export the interface from the service
export { FavoriteItem } from '../services/favoritesService';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: Omit<FavoriteItem, 'addedAt' | 'id'>) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  getFavoritesByCategory: (category: string) => FavoriteItem[];
  clearAllFavorites: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();

  // Load favorites from API when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [authState.isAuthenticated]);

  const loadFavorites = async () => {
    if (!authState.isAuthenticated || !authState.token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await favoritesService.getMyFavorites(authState.token);
      setFavorites(response.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt' | 'id'>) => {
    if (!authState.isAuthenticated || !authState.token) {
      throw new Error('User must be authenticated to add favorites');
    }

    setLoading(true);
    setError(null);
    try {
      await favoritesService.addToFavorites({
        itemId: item.itemId,
        itemName: item.itemName,
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
      }, authState.token);
      
      // Reload favorites to get the updated list
      await loadFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to favorites');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    if (!authState.isAuthenticated || !authState.token) {
      throw new Error('User must be authenticated to remove favorites');
    }

    setLoading(true);
    setError(null);
    try {
      await favoritesService.removeFromFavorites(itemId, authState.token);
      
      // Reload favorites to get the updated list
      await loadFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove from favorites');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(item => item.itemId === itemId);
  };

  const getFavoritesByCategory = (category: string) => {
    return favorites.filter(item => item.category === category);
  };

  const clearAllFavorites = async () => {
    if (!authState.isAuthenticated || !authState.token) {
      throw new Error('User must be authenticated to clear favorites');
    }

    setLoading(true);
    setError(null);
    try {
      await favoritesService.clearAllFavorites(authState.token);
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to clear favorites');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByCategory,
    clearAllFavorites,
    loading,
    error,
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
