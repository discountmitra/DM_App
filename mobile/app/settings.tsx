import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'navigation' | 'action';
  icon: string;
  iconColor: string;
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: logout
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Handle account deletion
            Alert.alert("Account Deleted", "Your account has been deleted successfully.");
          }
        }
      ]
    );
  };


  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          id: "1",
          title: "Notifications",
          description: "Push notifications and alerts",
          type: "toggle" as const,
          icon: "notifications-outline",
          iconColor: "#3b82f6",
          value: notifications,
          onPress: () => setNotifications(!notifications)
        },
        {
          id: "2",
          title: "Location Services",
          description: "Allow app to access your location",
          type: "toggle" as const,
          icon: "location-outline",
          iconColor: "#10b981",
          value: locationServices,
          onPress: () => setLocationServices(!locationServices)
        },
        {
          id: "3",
          title: "Dark Mode",
          description: "Switch to dark theme",
          type: "toggle" as const,
          icon: "moon-outline",
          iconColor: "#6b7280",
          value: darkMode,
          onPress: () => setDarkMode(!darkMode)
        },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        {
          id: "6",
          title: "Privacy Policy",
          description: "View our privacy policy",
          type: "navigation" as const,
          icon: "shield-outline",
          iconColor: "#ef4444",
          onPress: () => {}
        },
        {
          id: "7",
          title: "Terms of Service",
          description: "View terms and conditions",
          type: "navigation" as const,
          icon: "document-text-outline",
          iconColor: "#6b7280",
          onPress: () => {}
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          id: "8",
          title: "Edit Profile",
          description: "Update your personal information",
          type: "navigation" as const,
          icon: "person-outline",
          iconColor: "#3b82f6",
          onPress: () => {}
        },
        {
          id: "10",
          title: "Payment Methods",
          description: "Manage your payment options",
          type: "navigation" as const,
          icon: "card-outline",
          iconColor: "#10b981",
          onPress: () => {}
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: item.iconColor + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{ false: "#e5e7eb", true: item.iconColor }}
            thumbColor={item.value ? "#fff" : "#f4f3f4"}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: typeof settingsSections[0]) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < section.items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
      {/* Sticky Header */}
      <View>
        <LinearGradient colors={["#f8fafc", "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
      </View>

      {/* Settings Sections */}
      <View style={styles.content}>
        {settingsSections.map(renderSection)}
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
            <View style={styles.dangerLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#dc2626" + '20' }]}>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              </View>
              <Text style={styles.dangerTitle}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.dangerLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#dc2626" + '20' }]}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </View>
              <Text style={styles.dangerTitle}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfoContainer}>
        <Text style={styles.appInfoText}>Discount Mithra v2.1.0</Text>
        <Text style={styles.appInfoSubtext}>We bargain ❤️ You Save</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  content: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  settingRight: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 72,
  },
  dangerSection: {
    marginBottom: 24,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dangerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginLeft: 16,
  },
  appInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
