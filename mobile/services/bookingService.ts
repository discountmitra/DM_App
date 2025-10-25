import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/api';

export interface BookingData {
  orderData: {
    userName: string;
    userPhone: string;
    address: string;
    preferredTime: string;
    issueNotes?: string;
  };
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  requestId: string;
  notes?: string;
  amountPaid?: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: {
    id: string;
    orderId: string;
    requestId: string;
    amountPaid: number;
    userType: 'normal' | 'vip';
    status: string;
    bookingDate: string;
  };
}

class BookingService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Please login to book services');
      }

      const response = await fetch(`${BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        // Try to parse JSON error first; if it fails, fall back to text
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create booking');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to create booking (status ${response.status})`);
        }
      }

      const result = await response.json().catch(async () => {
        // In rare cases server might return non-JSON success; try text
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Invalid server response while creating booking');
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getMyBookings(): Promise<any[]> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/bookings/my-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch bookings');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to fetch bookings (status ${response.status})`);
        }
      }

      const result = await response.json().catch(async () => {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Invalid server response while fetching bookings');
        }
      });
      return result.bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch booking');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to fetch booking (status ${response.status})`);
        }
      }

      const result = await response.json().catch(async () => {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Invalid server response while fetching booking');
        }
      });
      return result.booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
}

export default new BookingService();
