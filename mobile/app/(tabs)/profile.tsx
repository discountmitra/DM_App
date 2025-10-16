import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useVip } from "../../contexts/VipContext";
import { useAuth } from "../../contexts/AuthContext";
import { logoImage } from "../../constants/assets";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { favorites } = useFavorites();
  const { userMode } = useVip();
  const { authState } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);


  // Simplified: remove animated header/bg change for a static, clean header

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffd88a", "#ffffff", "#f6f9ff"] : ["#cfe4ff", "#ffffff", "#f6f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
      {/* Top Section - User Name and Profile Picture (static) */}
      <View style={[styles.topSection, { paddingTop: insets.top + 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.userName}>{authState.user?.name || "User"}</Text>
          {userMode === 'vip' && (
            <View style={styles.vipBadge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.vipBadgeText}>VIP</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.profilePicture}>
          <Ionicons name="person" size={40} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search settings..."
            style={styles.searchInput}
            placeholderTextColor="#777"
          />
        </View>
      </View>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoRow}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoLabel}>Email</Text>
            <Text style={styles.userInfoValue}>joshua.smith@email.com</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoLabel}>Phone</Text>
            <Text style={styles.userInfoValue}>+1 (555) 123-4567</Text>
          </View>
        </View>
        <View style={styles.userInfoRow}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoLabel}>Location</Text>
            <Text style={styles.userInfoValue}>New York, NY</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoLabel}>Member Since</Text>
            <Text style={styles.userInfoValue}>Jan 2024</Text>
          </View>
        </View>
      </View>


      {/* Feature Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/favorites')}>
          <View style={styles.cardIcon}>
            <Ionicons name="heart" size={24} color="#10b981" />
          </View>
          <Text style={styles.cardText}>Favourites</Text>
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {
          router.push({
            pathname: '/orders'
          });
        }}>
          <View style={styles.cardIcon}>
            <Ionicons name="bag" size={24} color="#3b82f6" />
          </View>
          <Text style={styles.cardText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {
          router.push({
            pathname: '/referrals'
          });
        }}>
          <View style={styles.cardIcon}>
            <Ionicons name="people-outline" size={24} color="#10b981" />
          </View>
          <Text style={styles.cardText}>Referrals</Text>
        </TouchableOpacity>
      </View>

      {/* Account Settings Options */}
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffffff", "#f8fafc"] : ["#ffffff", "#f8fafc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.settingsContainer, userMode === 'vip' ? styles.vipOutline : undefined]}
      >



        <TouchableOpacity style={styles.settingItem} onPress={() => {
          router.push({
            pathname: '/notifications'
          });
        }}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconContainer, { backgroundColor: "#8b5cf615" }]}>
              <Ionicons name="notifications-outline" size={20} color="#8b5cf6" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Manage your notifications</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconContainer, { backgroundColor: "#3b82f615" }]}>
              <Ionicons name="language-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>Change app language</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/vip-subscription')}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconContainer, { backgroundColor: "#f59e0b15" }]}>
              <Ionicons name="star-outline" size={20} color="#f59e0b" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>VIP membership</Text>
              <Text style={styles.settingDescription}>Upgrade to premium features</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => {
          router.push({
            pathname: '/help-center'
          });
        }}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconContainer, { backgroundColor: "#f59e0b15" }]}>
              <Ionicons name="help-circle-outline" size={20} color="#f59e0b" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>Get help and find answers</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => {
          router.push({
            pathname: '/settings'
          });
        }}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconContainer, { backgroundColor: "#6b728015" }]}>
              <Ionicons name="settings-outline" size={20} color="#6b7280" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Settings</Text>
              <Text style={styles.settingDescription}>App preferences and privacy</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

      </LinearGradient>

      {/* App Information */}
      <View style={styles.appInfoContainer}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.appVersion}>Discount Mithra v2.1.0</Text>
        <View style={styles.legalLinks}>
          <TouchableOpacity>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: "transparent",
  },
  vipBadge: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#d97706',
  },
  vipBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    borderColor: "transparent",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  userInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  userInfoItem: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  userInfoLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 2,
    fontWeight: "500",
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
  },
  settingsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  vipOutline: {
    borderWidth: 1,
    borderColor: '#f59e0b55',
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.secondary,
  },
  appInfoContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    borderRadius: 0,
    padding: 0,
    marginBottom: Spacing.md,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  appVersion: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  legalLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  separator: {
    fontSize: 14,
    color: Colors.secondary,
    marginHorizontal: Spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginLeft: Spacing.sm,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
