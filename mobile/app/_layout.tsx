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

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      {authState.isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
