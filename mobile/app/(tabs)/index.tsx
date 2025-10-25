import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Header from "@/components/home/Header";
import DealCard from "../../components/home/DealCard";
import CategoryPreview from "../../components/home/CategoryPreview";
import { Spacing, Colors } from "../../theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal } from 'react-native';
import CustomTopBar from "@/components/home/CustomTopBar";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
// VIP banner now fetched from backend API

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { authState } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const confettiAnim = useRef(new Animated.Value(0)).current;
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const userMode = isVip ? 'vip' : 'normal';

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  // Welcome animation removed - no longer needed for deployment
  // VIP status is now managed by backend and AuthContext

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
        {/* Greeting + Search */}
        <CustomTopBar />

        {/* VIP Banner Image - Clickable */}
        <View style={styles.upgradeSection}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/vip-subscription')}> 
            <Image
              source={{ uri: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/vip-banner.png" }}
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

      <Modal visible={showWelcome} transparent animationType="fade" onRequestClose={() => setShowWelcome(false)}>
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeCard}>
            <Ionicons name="sparkles" size={48} color="#f59e0b" />
            <Text style={[styles.welcomeTitle, { marginTop: 10 }]}>Welcome to VIP!</Text>
            <Text style={styles.welcomeSubtitle}>You now have access to premium benefits and exclusive savings.</Text>

            <TouchableOpacity style={[styles.welcomeButton, { marginTop: 14 }]} onPress={() => setShowWelcome(false)}>
              <Ionicons name="thumbs-up" size={18} color="#ffffff" />
              <Text style={styles.welcomeButtonText}>Explore benefits</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  welcomeOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  welcomeCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, alignItems: 'center' },
  welcomeTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  welcomeSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  welcomeButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#f59e0b', flexDirection: 'row', alignItems: 'center', gap: 8 },
  welcomeButtonText: { color: '#fff', fontWeight: '700' },
  bannerImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
});
