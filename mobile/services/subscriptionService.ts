import { BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubscriptionStatus {
  isVip: boolean;
  vipExpiresAt: string | null;
  currentSubscription: {
    id: number;
    planName: string;
    amountPaid: number;
    subscriptionStart: string;
    subscriptionEnd: string;
    isActive: boolean;
  } | null;
}

export interface SubscriptionHistory {
  id: number;
  planName: string;
  amountPaid: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  isActive: boolean;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

class SubscriptionService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private async getToken(): Promise<string> {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${BASE_URL}/subscriptions/status`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return await response.json();
  }

  async purchaseSubscription(planData: {
    planId: string;
    planName: string;
    amountPaid: number;
    originalPrice?: number;
    discountApplied?: number;
    couponCode?: string;
  }): Promise<{ success: boolean; subscription: any }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${BASE_URL}/subscriptions/purchase`, {
      method: 'POST',
      headers,
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to purchase subscription');
    }

    return await response.json();
  }

  async cancelSubscription(reason?: string): Promise<{ success: boolean; message: string }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${BASE_URL}/subscriptions/cancel`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel subscription');
    }

    return await response.json();
  }

  async getSubscriptionHistory(): Promise<{ subscriptions: SubscriptionHistory[] }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${BASE_URL}/subscriptions/history`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription history');
    }

    return await response.json();
  }
}

export default new SubscriptionService();
