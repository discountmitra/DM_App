import 'react-native-reanimated';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Text, View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppNavigator() {
  const { authState } = useAuth();

  // Always show auth stack first (which contains welcome screen)
  // Welcome screen will auto-navigate based on auth state after showing for 6 seconds
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      {authState.isAuthenticated && authState.isLoading === false ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
