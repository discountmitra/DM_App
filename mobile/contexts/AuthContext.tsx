import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    phone: string;
    name?: string;
  } | null;
};

type AuthContextType = {
  authState: AuthState;
  login: (phone: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeProfile: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const login = async (phone: string, name?: string) => {
    try {
      const userData = { phone, name };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData,
      });
      // Navigate to tabs after successful login
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const completeProfile = async (name: string) => {
    try {
      const userData = { ...authState.user!, name };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setAuthState(prev => ({
        ...prev,
        user: userData,
      }));
      // Navigate to tabs after completing profile
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, completeProfile }}>
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
