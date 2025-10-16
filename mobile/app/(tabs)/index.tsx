import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Header from "@/components/home/Header";
import DealCard from "../../components/home/DealCard";
import CategoryPreview from "../../components/home/CategoryPreview";
import UserModeToggle from "../../components/common/UserModeToggle";
import { Spacing, Colors } from "../../theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import CustomTopBar from "@/components/home/CustomTopBar";
import { Ionicons } from "@expo/vector-icons";
import { useVip } from "../../contexts/VipContext";
import { vipBannerImage } from "../../constants/assets";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isVip, userMode } = useVip();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  const handleUpgrade = () => {
    router.push('/vip-subscription');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={userMode === 'vip' ? ["#ffd88a", "#ffffff", "#f6f9ff"] : ["#cfe4ff", "#ffffff", "#f6f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pageGradient}
      >
        {/* VIP Toggle - Moved to top */}
        <UserModeToggle onModeChange={(mode) => {
          console.log('Mode changed to:', mode);
        }} />

        {/* Greeting + Search */}
        <CustomTopBar />

        {/* VIP Banner Image - Clickable */}
        <View style={styles.upgradeSection}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/vip-subscription')}> 
            <Image
              source={vipBannerImage}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
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
});
