import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Header from "@/components/home/Header";
import DealCard from "../../components/home/DealCard";
import CategoryPreview from "../../components/home/CategoryPreview";
import { Spacing, Colors } from "../../theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import CustomTopBar from "@/components/home/CustomTopBar";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { BASE_URL } from "../../constants/api";
// VIP banner now fetched from backend API

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { authState } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const userMode = isVip ? 'vip' : 'normal';

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  // Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        console.log('Fetching assets from:', `${BASE_URL}/assets`);
        const response = await fetch(`${BASE_URL}/assets`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAssets(data);
        console.log('Assets fetched successfully:', data.length, 'items');
        console.log('VIP info asset:', data.find(asset => asset.type === 'vip_info'));
        console.log('VIP banner asset:', data.find(asset => asset.type === 'vip_banner'));
      } catch (error) {
        console.error('Error fetching assets:', error);
        // Set fallback assets so the app doesn't break
        setAssets([
          {
            id: 1,
            type: 'vip_banner',
            image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png',
            title: 'VIP Banner',
            description: 'VIP membership promotional banner'
          },
          {
            id: 2,
            type: 'vip_info',
            image: 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-info.jpg',
            title: 'VIP Info',
            description: 'VIP information banner for VIP users'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Welcome animation removed - no longer needed for deployment
  // VIP status is now managed by backend and AuthContext

  const handleUpgrade = () => {
    router.push('/vip-subscription');
  };

  // Get banner image based on user mode
  const getBannerImage = () => {
    if (isVip) {
      // For VIP users, show VIP info image (non-clickable)
      const vipInfoAsset = assets.find(asset => asset.type === 'vip_info');
      console.log('VIP user - VIP info asset:', vipInfoAsset);
      return vipInfoAsset?.image || 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-info.jpg';
    } else {
      // For normal users, show VIP banner (clickable)
      const vipBannerAsset = assets.find(asset => asset.type === 'vip_banner');
      console.log('Normal user - VIP banner asset:', vipBannerAsset);
      return vipBannerAsset?.image || 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png';
    }
  };

  // Get VIP info image (for normal users, shown above the banner)
  const getVipInfoImage = () => {
    const vipInfoAsset = assets.find(asset => asset.type === 'vip_info');
    return vipInfoAsset?.image || 'https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-info.jpg';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffd88a", "#ffffff", "#f6f9ff"] : ["#cfe4ff", "#ffffff", "#f6f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pageGradient}
      >
        {/* Greeting + Search */}
        <CustomTopBar />

        {/* VIP Info & Banner Images - Conditional based on user mode */}
        <View style={styles.upgradeSection}>
          {loading ? (
            // Show loading placeholder
            <View style={[styles.bannerImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#666' }}>Loading...</Text>
            </View>
          ) : isVip ? (
            // VIP users see non-clickable VIP info image
            <Image
              source={{ uri: getBannerImage() }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            // Normal users see VIP info image above the clickable VIP banner
            <View style={styles.normalUserBannerContainer}>
              <Image
                source={{ uri: getVipInfoImage() }}
                style={[styles.bannerImage, styles.vipInfoImage]}
                resizeMode="cover"
              />
              <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/vip-subscription')}> 
                <Image
                  source={{ uri: getBannerImage() }}
                  style={[styles.bannerImage, styles.vipBannerImage]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Hot Deal (static for now) */}
        <DealCard />

        {/* Categories Preview (only 4 shown here) */}
        <CategoryPreview />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  pageGradient: {
    flex: 1,
    paddingBottom: 16,
  },
  topSection: {},
  sectionBg: {},
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  upgradeSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  bannerText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  normalUserBannerContainer: {
    gap: 8,
  },
  vipInfoImage: {
    marginBottom: 8,
  },
  vipBannerImage: {
    // This will be the clickable VIP banner for normal users
  },
});
