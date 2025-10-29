import { BASE_URL, apiRequest } from '../constants/api';

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
  private getAuthToken(): string | null {
    // This will be passed from the calling component via AuthContext
    return null; // Will be overridden by the calling component
  }

  async createBooking(bookingData: BookingData, token: string): Promise<BookingResponse> {
    try {
      if (!token) {
        throw new Error('Please login to book services');
      }

      const result = await apiRequest('/bookings/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getMyBookings(token: string): Promise<any[]> {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await apiRequest('/bookings/my-bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return result.bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string, token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await apiRequest(`/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return result.booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
}

export default new BookingService();
