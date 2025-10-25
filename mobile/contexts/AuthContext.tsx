import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../constants/api';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: {
    phone: string;
    name?: string;
    email?: string;
    isVip?: boolean;
  } | null;
};

type AuthContextType = {
  authState: AuthState;
  register: (name: string, phone: string, email?: string) => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
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
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        // Optionally verify token with backend
        try {
          const res = await fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) throw new Error('Invalid token');
          const json = await res.json();
          await AsyncStorage.setItem('user', JSON.stringify(json.user));
        } catch {}
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          token,
          user,
        });
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
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email })
    });
    if (!res.ok) throw new Error('Failed to register');
    const json = await res.json();
    await AsyncStorage.setItem('token', json.token);
    await AsyncStorage.setItem('user', JSON.stringify(json.user));
    setAuthState({ isAuthenticated: true, isLoading: false, token: json.token, user: json.user });
    router.replace('/(tabs)');
  };

  const requestOtp = async (phone: string) => {
    const res = await fetch(`${BASE_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to request OTP');
    }
  };

  const verifyOtp = async (phone: string, code: string) => {
    const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    if (!res.ok) throw new Error('Failed to verify OTP');
    const json = await res.json();
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
      
      const res = await fetch(`${BASE_URL}/auth/me`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error('Failed to refresh user data');
      
      const json = await res.json();
      await AsyncStorage.setItem('user', JSON.stringify(json.user));
      setAuthState(prev => ({ ...prev, user: json.user }));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, register, requestOtp, verifyOtp, logout, refreshUserData }}>
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
