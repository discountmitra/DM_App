import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { FontWeights } from "../../theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        sceneStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontFamily: FontWeights.semibold },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 4,
          marginBottom: 8,
        },
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
          fontFamily: 'Inter_500Medium',
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={20} 
              color={color} 
            />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{ 
          title: "Categories", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={20} 
              color={color} 
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={20} 
              color={color} 
            />
          )
        }}
      />
    </Tabs>
  );
}
