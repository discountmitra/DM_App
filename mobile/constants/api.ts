// API Base URL - Production
export const BASE_URL = 'https://discount-mitra-app.onrender.com';

// For development (uncomment if needed)
// export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.19:4000';

// Enhanced fetch wrapper with better error handling for production
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.indexOf('http') === 0 ? url : `${BASE_URL}${url}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`[API] Making request to: ${fullUrl}`);
    const response = await fetch(fullUrl, defaultOptions);
    
    console.log(`[API] Response status: ${response.status}`);
    
    // Convert headers to object for logging
    const headersObj: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    console.log(`[API] Response headers:`, headersObj);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`[API] Success response:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
};


