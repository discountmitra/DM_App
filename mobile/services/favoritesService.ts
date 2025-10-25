import { BASE_URL } from '../constants/api';

export interface FavoriteItem {
  id: string;
  itemId: string;
  itemName: string;
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
  addedAt: string;
}

export interface AddFavoriteRequest {
  itemId: string;
  itemName: string;
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
}

class FavoritesService {
  private async makeRequest(endpoint: string, options: RequestInit = {}, token?: string) {
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    const response = await fetch(`${BASE_URL}/favorites${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async addToFavorites(favoriteData: AddFavoriteRequest, token: string): Promise<{ success: boolean; message: string; favorite: any }> {
    return this.makeRequest('/add', {
      method: 'POST',
      body: JSON.stringify(favoriteData),
    }, token);
  }

  async removeFromFavorites(itemId: string, token: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest(`/remove/${itemId}`, {
      method: 'DELETE',
    }, token);
  }

  async getMyFavorites(token: string): Promise<{ success: boolean; favorites: FavoriteItem[] }> {
    return this.makeRequest('/my-favorites', {}, token);
  }

  async checkIfFavorite(itemId: string, token: string): Promise<{ success: boolean; isFavorite: boolean }> {
    return this.makeRequest(`/check/${itemId}`, {}, token);
  }

  async getFavoritesByCategory(category: string, token: string): Promise<{ success: boolean; favorites: FavoriteItem[] }> {
    return this.makeRequest(`/category/${category}`, {}, token);
  }

  async clearAllFavorites(token: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/clear-all', {
      method: 'DELETE',
    }, token);
  }
}

const favoritesService = new FavoritesService();
export default favoritesService;
