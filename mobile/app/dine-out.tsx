import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { restaurantData, Restaurant } from "../constants/restaurantData";
import PayBillCard from "../components/common/PayBillCard";
import { useVip } from "../contexts/VipContext";

export default function DineOutScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isVip, userMode } = useVip();
  const [billAmount, setBillAmount] = useState('');

  // Get restaurant data from params
  const restaurant: Restaurant = useMemo(() => {
    const restaurantId = params.restaurantId as string;
    return restaurantData.find(r => r.id === restaurantId) || restaurantData[0];
  }, [params.restaurantId]);

  // Define discount percentages for normal and VIP users
  const normalDiscountPercentage = 5; // 5% discount for normal users
  const vipDiscountPercentage = 10; // 10% discount for VIP users
  
  // Get current discount based on user status
  const currentDiscountPercentage = isVip ? vipDiscountPercentage : normalDiscountPercentage;
  
  
  const finalAmount = useMemo(() => {
    const amount = parseFloat(billAmount) || 0;
    const discount = (amount * currentDiscountPercentage) / 100;
    return amount - discount;
  }, [billAmount, currentDiscountPercentage]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    if (!billAmount || parseFloat(billAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid bill amount');
      return;
    }
    setShowConfirm(true);
  };

  const confirmPayment = () => {
    setShowConfirm(false);
    setShowProcessing(true);
    setTimeout(() => {
      setShowProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Single Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{restaurant.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerDineOut}>Dine Out</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>


        {/* Bill Payment Card */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <PayBillCard
            billAmount={billAmount}
            onChangeAmount={setBillAmount}
            discountPercentage={currentDiscountPercentage}
            vipDiscountPercentage={vipDiscountPercentage}
            isVip={isVip}
            onPressPay={handlePayment}
            onVipUpgrade={() => router.push('/vip-subscription')}
          />
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Instant discount</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Secure payment</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>No hidden charges</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Instant confirmation</Text>
            </View>
          </View>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYouContainer}>
          <View style={styles.thankYouIcon}>
            <Ionicons name="heart" size={24} color="#ef4444" />
          </View>
          <Text style={styles.thankYouTitle}>Thank you for visiting!</Text>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#7c3aed" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <Text style={styles.modalSubtitle}>Pay ₹{finalAmount.toFixed(2)} after {currentDiscountPercentage}% off?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={confirmPayment}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={showProcessing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Processing payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>
            <Text style={styles.successModalTitle}>Payment Successful</Text>
            <Text style={styles.successModalSubtitle}>Show this confirmation to the restaurant.</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDineOut: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 2,
  },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  callText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 6,
  },
  payBillCard: {
    backgroundColor: "#1f2937",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1f2937",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  payBillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  payBillTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  payBillIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  payBillTitleContainer: {
    flex: 1,
  },
  payBillTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  payBillSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c3aed",
    marginLeft: 4,
  },
  billInputSection: {
    marginBottom: 20,
  },
  billInputLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    fontWeight: "500",
  },
  billInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  currencySymbol: {
    marginRight: 8,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  billInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7c3aed",
    marginLeft: 4,
  },
  billSummary: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  billSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  billSummaryTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  billSummaryContent: {
    padding: 20,
  },
  billSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  billSummaryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  billSummaryValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  billSummaryDiscount: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  billSummaryDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 12,
  },
  finalAmountLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  finalAmountValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  savingsHighlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
    marginLeft: 6,
  },
  extraOfferContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  extraOfferIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(245,158,11,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  extraOfferText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    lineHeight: 16,
  },
  copyCodeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(245,158,11,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  benefitsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 6,
    fontWeight: "500",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  quickInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quickInfoText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    fontWeight: "500",
  },
  offersContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  offersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  offersTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c3aed",
    marginRight: 4,
  },
  offersScroll: {
    paddingRight: 16,
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  offerCardPrimary: {
    backgroundColor: "#7c3aed",
  },
  offerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 12,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  offerIconSecondary: {
    backgroundColor: "#f0fdf4",
  },
  offerIconTertiary: {
    backgroundColor: "#fffbeb",
  },
  offerBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerBadgeSecondary: {
    backgroundColor: "#10b981",
  },
  offerBadgeTertiary: {
    backgroundColor: "#f59e0b",
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  offerBadgeTextSecondary: {
    color: "#fff",
  },
  offerBadgeTextTertiary: {
    color: "#fff",
  },
  offerContent: {
    padding: 20,
    paddingTop: 0,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c3aed",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuresContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
  thankYouContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  thankYouIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  thankYouMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  // Modal styles (aligned with other screens)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#7c3aed', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});
