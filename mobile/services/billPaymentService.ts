import { BASE_URL } from '../constants/api';

interface BillPaymentData {
  category: string;
  merchantName: string;
  billAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod?: string;
  notes?: string;
}

interface BillPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    transactionId: string;
    category: string;
    merchantName: string;
    billAmount: number;
    discountAmount: number;
    finalAmount: number;
    paymentStatus: string;
    paymentDate: string;
  };
}

interface BillPaymentHistoryResponse {
  success: boolean;
  data: {
    payments: Array<{
      id: number;
      category: string;
      merchantName: string;
      billAmount: number;
      discountAmount: number;
      finalAmount: number;
      paymentStatus: string;
      transactionId: string;
      paymentDate: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const billPaymentService = {
  async createBillPayment(paymentData: BillPaymentData, token: string): Promise<BillPaymentResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/bill-payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Payment failed';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating bill payment:', error);
      throw error;
    }
  },

  async getBillPaymentHistory(token: string, page: number = 1, limit: number = 10, category?: string): Promise<BillPaymentHistoryResponse> {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${BASE_URL}/bill-payments/history?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to fetch payment history';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching bill payment history:', error);
      throw error;
    }
  },

  async getBillPaymentDetails(paymentId: number, token: string) {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/bill-payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to fetch payment details';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching bill payment details:', error);
      throw error;
    }
  },

  async getPaymentStats(token: string, category?: string) {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`${BASE_URL}/bill-payments/stats/summary?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to fetch payment statistics';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  }
};
