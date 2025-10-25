import { BASE_URL } from '../constants/api';

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
  private getAuthHeaders(token: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
    const headers = this.getAuthHeaders(token);
    const response = await fetch(`${BASE_URL}/subscriptions/status`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return await response.json();
  }

  async purchaseSubscription(token: string, planData: {
    planId: string;
    planName: string;
    amountPaid: number;
    originalPrice?: number;
    discountApplied?: number;
    couponCode?: string;
  }): Promise<{ success: boolean; subscription: any }> {
    const headers = this.getAuthHeaders(token);
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

  async cancelSubscription(token: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const headers = this.getAuthHeaders(token);
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

  async getSubscriptionHistory(token: string): Promise<{ subscriptions: SubscriptionHistory[] }> {
    const headers = this.getAuthHeaders(token);
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
