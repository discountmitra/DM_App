import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AppState } from 'react-native';
import { BASE_URL, apiRequest } from '../constants/api';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: {
    phone: string;
    name?: string;
    email?: string;
    isVip?: boolean;
    newId?: string;
  } | null;
};

type AuthContextType = {
  authState: AuthState;
  register: (name: string, phone: string, email?: string) => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  requestOtpForRegistration: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    user: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
    
    // Listen for app state changes to refresh auth when app comes to foreground
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && authState.isAuthenticated) {
        // App came to foreground, verify token is still valid
        checkTokenValidity().then(isValid => {
          if (!isValid) {
            logout();
          }
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [authState.isAuthenticated]);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        // Verify token with backend
        try {
          const json = await apiRequest('/auth/me', { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          
          await AsyncStorage.setItem('user', JSON.stringify(json.user));
          
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            token,
            user: json.user,
          });
        } catch (err) {
          // Token is invalid, clear storage and set unauthenticated
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            user: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          user: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
      });
    }
  };

  const register = async (name: string, phone: string, email?: string) => {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, email })
    });
    // Don't log in yet - wait for OTP verification
  };

  const requestOtp = async (phone: string) => {
    await apiRequest('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  };

  const requestOtpForRegistration = async (phone: string) => {
    await apiRequest('/auth/otp/request-registration', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  };

  const verifyOtp = async (phone: string, code: string) => {
    const json = await apiRequest('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code })
    });
    await AsyncStorage.setItem('token', json.token);
    await AsyncStorage.setItem('user', JSON.stringify(json.user));
    setAuthState({ isAuthenticated: true, isLoading: false, token: json.token, user: json.user });
    router.replace('/(tabs)');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setAuthState({ isAuthenticated: false, isLoading: false, token: null, user: null });
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      
      const json = await apiRequest('/auth/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      await AsyncStorage.setItem('user', JSON.stringify(json.user));
      setAuthState(prev => ({ ...prev, user: json.user }));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, the token might be invalid, so logout
      await logout();
    }
  };

  // Add a function to check token validity
  const checkTokenValidity = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return false;
      
      await apiRequest('/auth/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, register, requestOtp, requestOtpForRegistration, verifyOtp, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
