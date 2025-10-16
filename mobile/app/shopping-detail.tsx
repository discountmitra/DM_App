import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, TextInput, Alert } from "react-native";
import { FontSizes, FontWeights } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import LikeButton from "../components/common/LikeButton";
import { useVip } from "../contexts/VipContext";
import PayBillCard from "../components/common/PayBillCard";
import { defaultImage } from "../constants/assets";

type Item = {
  id: string;
  name: string;
  specialist: string;
  description: string;
  image?: string;
  payPrice: number; // price to buy coupon
};

const RAW: Array<Omit<Item, 'payPrice'>> = [
  {
    id: "vishala-shopping-mall",
    name: "Vishala Shopping Mall",
    specialist: "Men, Women & Kids Shopping mall",
    description: "Normal: 5% off • VIP: 10% off (Pay ₹19 Get Discount Coupon)",
    image: "https://plus.unsplash.com/premium_photo-1683121817275-85d1dcf9e4c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvcHBpbmclMjBtYWxsfGVufDB8fDB8fHww",
  },
  {
    id: "cmr-shopping-mall",
    name: "CMR Shopping Mall",
    specialist: "Men, Women & Kids Shopping mall",
    description: "Normal: 5% off • VIP: 10% off (Pay ₹9 Get Discount Coupon)",
    image: "https://img.staticmb.com/mbcontent/images/crop/uploads/2024/11/cmr-shopping-mall_0_1200.jpg.webp",
  },
  {
    id: "adven-mens-store",
    name: "Adven Mens Store sircilla",
    specialist: "Men Shopping Center",
    description: "Normal: 7% off • VIP: 15% off (Pay ₹19 Get Discount Coupon)",
    image: "https://images.unsplash.com/photo-1559204260-9d9f024ab30a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVucyUyMHN0b3JlfGVufDB8fDB8fHww",
  },
  {
    id: "trends",
    name: "Trends",
    specialist: "Store",
    description: "Normal: 3% off • VIP: 5% off (Pay ₹9 Get Discount Coupon)",
    image: "https://www.legalmantra.net/admin/assets/upload_image/blog/Trends.jpg",
  },
  {
    id: "jockey-india",
    name: "Jockey India",
    specialist: "https://www.jockey.in/",
    description: "Normal: 6% off • VIP: 12% off (Pay ₹19 Get Discount Coupon)",
    image: "https://www.infinitimall.com/wp-content/uploads/2023/09/Jockey-Malad-Infinti-Mall-1.jpg",
  },
];

export default function ShoppingDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { userMode, isVip } = useVip();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [billAmount, setBillAmount] = useState("");
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const item = useMemo<Item | undefined>(() => {
    const base = RAW.find(r => r.id === params.id);
    if (!base) return undefined;
    // Price: Normal ₹19, VIP ₹9 across shopping
    const basePrice = userMode === 'vip' ? 9 : 19;
    return { ...base, payPrice: basePrice };
  }, [params.id, userMode]);

  const extractDiscountSummary = (desc: string): string => {
    // Try to capture percentage and voucher mapping from description
    const percent = desc.match(/(\d+)%/i)?.[1];
    const payGet = desc.match(/Pay\s*(\d+)\s*.*?get\s*(\d+)/i);
    if (percent && payGet) {
      return `${percent}% off • Pay ₹${payGet[1]} ⇒ Voucher ₹${payGet[2]}`;
    }
    if (percent) return `${percent}% discount`;
    return 'Discount coupon applicable as per offer';
  };

  const getDiscountPercentage = (desc: string, storeName: string, userMode: string): number => {
    // Define discount percentages for each store based on user type
    const discounts: Record<string, { normal: number; vip: number }> = {
      'Vishala Shopping Mall': { normal: 5, vip: 10 },
      'Trends': { normal: 3, vip: 5 },
      'Adven Mens Store sircilla': { normal: 7, vip: 15 },
      'Jockey India': { normal: 6, vip: 12 },
      'CMR Shopping Mall': { normal: 5, vip: 10 }, // Default fallback
    };
    
    const storeDiscount = discounts[storeName] || discounts['CMR Shopping Mall'];
    return userMode === 'vip' ? storeDiscount.vip : storeDiscount.normal;
  };
  const discountPercentage = getDiscountPercentage(item?.description ?? '', item?.name ?? '', userMode);
  const vipDiscountPercentage = getDiscountPercentage(item?.description ?? '', item?.name ?? '', 'vip');
  const billNum = parseFloat(billAmount) || 0;
  const discountValue = (billNum * discountPercentage) / 100;
  const finalAmount = Math.max(0, billNum - discountValue);

  // Pay flow handled via confirm -> loading -> success modals

  if (!item) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontWeight: '700', color: '#111827' }}>Item not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#7c3aed', fontWeight: '700' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <View style={styles.stickyHeaderContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.stickyHeaderInfo}>
            <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{item?.name || 'Shopping'}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>Shopping</Text>
                <Text style={styles.stickyHeaderPrice}>{item?.specialist}</Text>
              </View>
            </View>
            <LikeButton 
              item={{ id: item!.id, name: item!.name, category: 'Shopping', subcategory: 'Malls', image: item!.image, description: item!.description }}
              size={24}
              style={styles.headerActionButton}
            />
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        setShowStickyHeader(y > 100);
      }} scrollEventThrottle={16}>
        {/* Hero Section with overlay and actions (aligned with other detail pages) */}
        <View style={styles.hero}>
          <Image source={item.image && /^https?:\/\//.test(item.image) ? { uri: item.image } : defaultImage} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.heroBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroRightActions}>
              <LikeButton 
                item={{
                  id: item.id,
                  name: item.name,
                  category: 'Shopping',
                  subcategory: 'Malls',
                  image: item.image,
                  description: item.description,
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.9)" }]}
              />
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Info Card (overlapping like hospital detail) */}
          <View style={styles.infoCardTop}>
            <View style={styles.infoHeaderRow}>
              <View style={styles.hospitalIcon}><Ionicons name="bag-handle" size={24} color="#7c3aed" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="storefront" size={12} color="#7c3aed" />
                  <Text style={styles.locationText} numberOfLines={1}>{item.specialist}</Text>
                </View>
                <View style={styles.metaRow}> 

                  <View style={styles.categoryPill}><Text style={styles.categoryPillText}>Shopping</Text></View>
                </View>
              </View>
              <View style={styles.modeBadge}><Text style={styles.modeBadgeText}>{userMode === 'vip' ? 'VIP' : 'Normal'}</Text></View>
            </View>
          </View>


          {/* Pay Bill (dine-out style) */}
          <View style={{ marginTop: 16 }}>
            <PayBillCard
              billAmount={billAmount}
              onChangeAmount={setBillAmount}
              discountPercentage={discountPercentage}
              vipDiscountPercentage={vipDiscountPercentage}
              isVip={isVip}
              onPressPay={() => {
                if (!billAmount || parseFloat(billAmount) <= 0) { Alert.alert('Enter amount', 'Please enter a valid bill amount'); return; }
                setShowConfirm(true);
              }}
              onVipUpgrade={() => router.push('/vip-subscription')}
            />
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Confirmation Modal (reuse dine-out flow) */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#7c3aed" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <Text style={styles.modalSubtitle}>Pay ₹{finalAmount.toFixed(2)} after {discountPercentage}% off?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => {
                setShowConfirm(false);
                setIsLoading(true);
                setTimeout(() => { setIsLoading(false); setShowSuccess(true); }, 1500);
              }}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Processing payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
            </View>
            <Text style={styles.successModalTitle}>Payment Successful</Text>
            <Text style={styles.successModalSubtitle}>Show this confirmation at the counter</Text>
            <View style={styles.successDetails}>
              <Ionicons name="pricetags" size={16} color="#7c3aed" />
              <Text style={styles.successDetailsText}>Saved ₹{((parseFloat(billAmount)||0)*discountPercentage/100).toFixed(2)} • {discountPercentage}% off</Text>
            </View>
            <TouchableOpacity style={styles.successButton} onPress={() => { setShowSuccess(false); router.back(); }}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff', paddingTop: 50, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', zIndex: 1000, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 },
  stickyHeaderContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  stickyHeaderInfo: { flex: 1, marginHorizontal: 16 },
  stickyHeaderTitle: { fontSize: FontSizes.subtitle, color: '#111827', marginBottom: 4, fontFamily: FontWeights.semibold },
  stickyHeaderDetails: { flexDirection: 'row', alignItems: 'center' },
  stickyHeaderRating: { fontSize: 12, color: '#6b7280', marginRight: 12 },
  stickyHeaderPrice: { fontSize: 12, color: '#6b7280' },
  headerActionButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  hero: { height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroTop: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroRightActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroLikeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  body: { backgroundColor: '#fff', marginTop: -20, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  title: { fontSize: FontSizes.title, color: '#111827', fontFamily: FontWeights.bold },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locationText: { marginLeft: 4, fontSize: 12, color: '#6b7280' },
  modeBadge: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  modeBadgeText: { fontSize: 12, color: '#111827', fontFamily: FontWeights.semibold },
  // Full-width info card like healthcare: stretch to screen edges
  infoCardTop: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: -40,  borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3, marginHorizontal: -16 },
  infoHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  hospitalIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f5f3ff', alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  categoryPill: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  categoryPillText: { fontSize: 12, color: '#6b7280', fontFamily: FontWeights.medium },
  offerCard: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 2, borderRadius: 8, marginTop: 16 },
  offerText: { color: '#4c1d95', flex: 1, fontFamily: FontWeights.semibold },
  infoNote: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', padding: 12, borderRadius: 12, marginTop: 12 },
  infoText: { color: '#1e40af', flex: 1, fontFamily: FontWeights.medium },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', marginTop: 12 },
  sectionTitle: { fontSize: FontSizes.subtitle, color: '#111827', marginBottom: 6, fontFamily: FontWeights.semibold },
  buyBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  buyBtnText: { color: '#fff', fontFamily: FontWeights.bold },
  // Pay Bill styles are now encapsulated in components/common/PayBillCard
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: FontSizes.title, color: '#111827', textAlign: 'center', marginBottom: 6, fontFamily: FontWeights.bold },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, color: '#6b7280', fontFamily: FontWeights.semibold },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#7c3aed', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, color: '#ffffff', fontFamily: FontWeights.bold },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, color: '#111827', marginTop: 12, textAlign: 'center', fontFamily: FontWeights.semibold },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, alignItems: 'center' },
  successIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successModalTitle: { fontSize: 18, color: '#111827', fontFamily: FontWeights.bold },
  successModalSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  codeBox: { marginTop: 14, paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#f9fafb' },
  code: { fontSize: 22, letterSpacing: 1, color: '#7c3aed', fontFamily: FontWeights.bold },
  successDetails: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  successDetailsText: { color: '#4c1d95', fontFamily: FontWeights.semibold },
  successButton: { marginTop: 16, backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  successButtonText: { color: '#fff', fontFamily: FontWeights.bold },
});


