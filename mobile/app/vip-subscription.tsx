import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Modal, ActivityIndicator, Animated, TouchableWithoutFeedback, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import subscriptionService from '../services/subscriptionService';

// Define subscription plan type
type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  features: string[];
};

// Define subscription plans locally
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 99,
    originalPrice: 99,
    duration: "1 month",
    features: [
      "Unlimited service requests",
      "Priority customer support",
      "Exclusive VIP discounts",
      "Free premium services",
      "24/7 dedicated support"
    ]
  },
  {
    id: "halfyearly",
    name: "Half Yearly",
    price: 699,
    originalPrice: 699,
    duration: "6 months",
    features: [
      "Unlimited service requests",
      "Priority customer support",
      "Exclusive VIP discounts",
      "Free premium services",
      "24/7 dedicated support"
    ]
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 999,
    originalPrice: 999,
    duration: "12 months",
    features: [
      "Unlimited service requests",
      "Priority customer support",
      "Exclusive VIP discounts",
      "Free premium services",
      "24/7 dedicated support"
    ]
  }
];

export default function VipSubscriptionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { authState, refreshUserData } = useAuth();
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["halfyearly"]));
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscountPct, setCouponDiscountPct] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const welcomeAnim = useRef(new Animated.Value(0)).current;

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (isVip) {
        try {
          const status = await subscriptionService.getSubscriptionStatus(authState.token!);
          setSubscriptionData(status.currentSubscription);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
        }
      }
    };
    fetchSubscriptionStatus();
  }, [isVip]);

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (subscriptionData?.subscriptionEnd) {
      const now = new Date();
      const endDate = new Date(subscriptionData.subscriptionEnd);
      const diffTime = endDate.getTime() - now.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    return isVip ? 365 : 0;
  };

  // Simplified subscription status for demo
  const subscriptionStatus = {
    planName: subscriptionData?.planName || (isVip ? "VIP Member" : "Normal User"),
    daysRemaining: calculateDaysRemaining()
  };
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmerAnim]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan) return;
    
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      const normalized = couponCode.trim().toUpperCase();
      const isValidCoupon = normalized === 'WELCOME' || normalized === 'MYMLAKTR' || normalized === 'MANASRCL';
      const pct = normalized === 'WELCOME' ? 0.2 : normalized === 'MYMLAKTR' ? 0.5 : normalized === 'MANASRCL' ? 0.3 : 0;
      const appliedPct = couponApplied ? (couponDiscountPct || pct) : 0;
      const finalPrice = Math.max(0, Math.round(selectedPlan.price * (1 - appliedPct)));

      // Real subscription process
      const result = await subscriptionService.purchaseSubscription(authState.token!, {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amountPaid: finalPrice,
        originalPrice: selectedPlan.originalPrice,
        discountApplied: appliedPct,
        couponCode: isValidCoupon ? normalized : undefined
      });

      setIsLoading(false);
      console.log('Subscription completed:', result);
      
      // Refresh user data to update VIP status
      await refreshUserData();
      
      // Refresh subscription data
      const status = await subscriptionService.getSubscriptionStatus(authState.token!);
      setSubscriptionData(status.currentSubscription);

      // Navigate to Home tab after successful purchase
      try { router.replace('/(tabs)'); } catch { router.back(); }
    } catch (error) {
      setIsLoading(false);
      console.error('Subscription failed:', error);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setShowCancelModal(false);
    setIsLoading(true);

    try {
      // Real cancellation process with user's reason
      const result = await subscriptionService.cancelSubscription(authState.token!, cancellationReason.trim());
      setIsLoading(false);
      console.log('Subscription cancelled:', result);
      
      // Refresh user data to update VIP status
      await refreshUserData();
      
      // Clear subscription data
      setSubscriptionData(null);
      
      // Show thank you modal
      setShowThankYouModal(true);
    } catch (error) {
      setIsLoading(false);
      console.error('Cancellation failed:', error);
    }
  };


  return (
  <LinearGradient colors={["#0b0b0f", "#111113"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
    <LinearGradient colors={["#d4af37", "#f5d076"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGradient}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#d4af37" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>VIP Subscription</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
    </LinearGradient>

    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {isVip ? (
          // VIP User - Show current subscription details
          <>
          <LinearGradient colors={["#1a1a1f", "#0f0f14"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.currentPlanCard}>
            <Animated.View
              pointerEvents="none"
              style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 400] }) }] } ]}
            >
              <LinearGradient colors={["transparent", "rgba(255,215,0,0.35)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </Animated.View>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.vipBadgeText}>VIP ACTIVE</Text>
              </View>
              <Text style={styles.heroTitle}>Welcome to VIP!</Text>
              <Text style={styles.heroSubtitle}>You're enjoying premium benefits and exclusive savings.</Text>
              {subscriptionData?.couponCode ? (
                <View style={styles.couponAppliedPill}>
                  <Ionicons name="pricetags" size={14} color="#065f46" />
                  <Text style={styles.couponAppliedText}>Coupon applied: {subscriptionData.couponCode}</Text>
                </View>
              ) : null}
              
              <View style={styles.planDetails}>
                <View style={styles.planDetailRow}>
                  <Text style={styles.planDetailLabel}>Current Plan:</Text>
                  <Text style={styles.planDetailValue}>{subscriptionStatus.planName}</Text>
                </View>
                <View style={styles.planDetailRow}>
                  <Text style={styles.planDetailLabel}>Days Remaining:</Text>
                  <Text style={styles.planDetailValue}>{subscriptionStatus.daysRemaining} days</Text>
                </View>
                {subscriptionData?.amountPaid !== undefined ? (
                  <View style={[styles.planDetailRow, { marginTop: 4 }]}> 
                    <Text style={styles.planDetailLabel}>Amount Paid:</Text>
                    <Text style={styles.planDetailValue}>₹{subscriptionData.amountPaid}</Text>
                  </View>
                ) : null}
              </View>
          </LinearGradient>

          <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Your VIP Benefits</Text>
              {(SUBSCRIPTION_PLANS.find(p => p.id === subscriptionData?.planId)?.features || [
                "Unlimited service requests",
                "Priority customer support", 
                "Exclusive VIP discounts",
                "Free premium services",
                "24/7 dedicated support"
              ]).map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelSubscription}>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Normal User - Show subscription plans
          <>
          <LinearGradient colors={["#1a1a1f", "#0f0f14"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <Animated.View
              pointerEvents="none"
              style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 400] }) }] } ]}
            >
              <LinearGradient colors={["transparent", "rgba(255,215,0,0.35)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </Animated.View>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.vipBadgeText}>VIP</Text>
              </View>
              <Text style={styles.heroTitle}>Unlock Premium Savings</Text>
              <Text style={styles.heroSubtitle}>Get unlimited free requests, exclusive deals, and priority support.</Text>
          </LinearGradient>

            <Text style={styles.sectionTitle}>Choose Your Plan</Text>

             {/* Coupon Box - Black/Gold theme */}
             <LinearGradient colors={["#15151b", "#0d0d12"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <Ionicons name="pricetags" size={16} color="#d4af37" />
                <Text style={[styles.couponTitle, { color: '#f8fafc' }]}>Have a coupon?</Text>
              </View>
              <View style={styles.couponRow}>
                <View style={styles.couponInputContainer}>
                  <TextInput
                  value={couponCode}
                  onChangeText={(t) => {
                    setCouponCode(t);
                    setCouponError(null);
                    setCouponApplied(false);
                  }}
                  placeholder="WELCOME"
                  placeholderTextColor="#9ca3af"
                  style={[styles.couponInput, (couponApplied || couponCode.trim().length > 0) && { paddingRight: 36 }]}
                  autoCapitalize="characters"
                  />
                  {(couponApplied || couponCode.trim().length > 0) && (
                    <TouchableOpacity
                      style={styles.clearBtnInside}
                      onPress={() => { setCouponCode(''); setCouponApplied(false); setCouponError(null); }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close" size={14} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => {
                    const code = couponCode.trim().toUpperCase();
                    if (!code) {
                      setCouponError('Enter a coupon code');
                      setCouponApplied(false);
                      setCouponDiscountPct(0);
                      return;
                    }
                    if (code === 'WELCOME') {
                      setCouponApplied(true);
                      setCouponDiscountPct(0.2);
                      setCouponError(null);
                    } else if (code === 'MYMLAKTR') {
                      setCouponApplied(true);
                      setCouponDiscountPct(0.5);
                      setCouponError(null);
                    } else if (code === 'MANASRCL') {
                      setCouponApplied(true);
                      setCouponDiscountPct(0.3);
                      setCouponError(null);
                    } else {
                      setCouponApplied(false);
                      setCouponDiscountPct(0);
                      setCouponError('Invalid coupon');
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.applyBtnText}>{couponApplied ? 'Applied' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
              {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
              {couponApplied ? (
                <View style={styles.couponSuccessRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.couponSuccessText}>Coupon applied! {Math.round((couponDiscountPct || 0) * 100)}% off on all plans.</Text>
                </View>
              ) : null}
            </LinearGradient>

            {SUBSCRIPTION_PLANS.map((plan) => {
              const expanded = expandedIds.has(plan.id);
              return (
                <View key={plan.id} style={[styles.planCard, expanded && styles.planCardExpanded]}>
                  <TouchableOpacity activeOpacity={0.9} style={styles.planHeader} onPress={() => toggleExpand(plan.id)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDuration}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planPriceWrap}>
                      {couponApplied ? (
                        <View style={styles.priceWrap}>
                          <Text style={styles.goldPriceTextOnly}>₹{Math.max(0, Math.round(plan.price * (1 - (couponDiscountPct || 0))))}</Text>
                          <Text style={styles.strikedPrice}>₹{plan.price}</Text>
                        </View>
                      ) : (
                        <Text style={styles.planPrice}>₹{plan.price}</Text>
                      )}
                    </View>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
                  </TouchableOpacity>

                  {plan.popular && (
                    <View style={styles.ribbon}><Text style={styles.ribbonText}>Most Popular</Text></View>
                  )}

                  {expanded && (
                    <View style={styles.planBody}>
                      {plan.features.map((feature, i) => (
                        <View key={i} style={styles.benefitRow}>
                          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                          <Text style={styles.benefitText}>{feature}</Text>
                        </View>
                      ))}

                      <TouchableOpacity style={styles.ctaBtn} onPress={() => handleSubscribe(plan)}>
                        <Ionicons name="flash" size={16} color="#fff" />
                        <Text style={styles.ctaText}>{couponApplied ? `Subscribe with ${Math.round((couponDiscountPct || 0) * 100)}% OFF` : 'Subscribe Now'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Subscription Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="star" size={32} color="#f59e0b" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            <Text style={styles.modalSubtitle}>
              {(() => {
                if (!selectedPlan) return '' as any;
                const code = couponCode.trim().toUpperCase();
                const pct = code === 'WELCOME' ? 0.2 : code === 'MYMLAKTR' ? 0.5 : code === 'MANASRCL' ? 0.3 : 0;
                const finalPrice = pct ? Math.max(0, Math.round(selectedPlan.price * (1 - pct))) : selectedPlan.price;
                return `You're about to subscribe to ${selectedPlan.name} for ₹${finalPrice}${pct ? ` (${Math.round(pct*100)}% OFF applied)` : ''}`;
              })()}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={confirmSubscription}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm & Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Cancel Subscription Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalCard}>
            <View style={styles.cancelModalIconContainer}>
              <View style={styles.cancelModalIconCircle}>
                <Ionicons name="warning" size={40} color="#ef4444" />
              </View>
            </View>

            <Text style={styles.cancelModalTitle}>Cancel VIP Subscription?</Text>
            <Text style={styles.cancelModalSubtitle}>
              You'll lose access to all premium benefits and exclusive features. This action cannot be undone.
            </Text>

            <View style={styles.reasonInputContainer}>
              <Text style={styles.reasonInputLabel}>Please tell us why you're cancelling:</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="e.g., Too expensive, Not using enough, Found alternative..."
                placeholderTextColor="#9ca3af"
                value={cancellationReason}
                onChangeText={setCancellationReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.cancelModalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelModalButtonSecondary}
                onPress={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                }}
              >
                <Ionicons name="arrow-back" size={18} color="#6b7280" />
                <Text style={styles.cancelModalButtonSecondaryText}>Keep VIP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelModalButtonPrimary, !cancellationReason.trim() && styles.cancelModalButtonPrimaryDisabled]}
                onPress={confirmCancellation}
                disabled={!cancellationReason.trim()}
              >
                <Text style={styles.cancelModalButtonPrimaryText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>

      {/* Thank You Modal */}
      <Modal visible={showThankYouModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.thankYouModalCard}>
            <View style={styles.thankYouIconContainer}>
              <View style={styles.thankYouIconCircle}>
                <Ionicons name="heart" size={40} color="#10b981" />
              </View>
            </View>

            <Text style={styles.thankYouTitle}>Thank You!</Text>
            <Text style={styles.thankYouSubtitle}>
              Thank you for your feedback. We'll try to improve our services based on this.
            </Text>

             <TouchableOpacity
               style={styles.thankYouButton}
               onPress={() => {
                 setShowThankYouModal(false);
                 router.replace('/(tabs)');
               }}
             >
              <Ionicons name="home" size={18} color="#ffffff" />
              <Text style={styles.thankYouButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Welcome Celebration Modal */}
      <Modal visible={showWelcomeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.welcomeModalCard}>
            <View style={styles.welcomeHeader}>
              <Text style={styles.welcomeTitle}>Welcome to VIP!</Text>
              <Text style={styles.welcomeSubtitle}>Enjoy premium benefits and exclusive savings.</Text>
            </View>

            {/* Simple balloon/confetti animation using circles */}
            <View style={styles.celebrationStage}>
              {[...Array(8)].map((_, i) => {
                const delay = i * 80;
                const translateY = welcomeAnim.interpolate({ inputRange: [0, 1], outputRange: [60 + i * 6, -20] });
                const opacity = welcomeAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.9, 1] });
                const scale = welcomeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
                const left = (i % 2 === 0 ? 20 : 60) + (i * 8);
                const bg = i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#10b981' : '#60a5fa';
                return (
                  <Animated.View
                    key={i}
                    style={{
                      position: 'absolute',
                      left,
                      bottom: 0,
                      width: 14,
                      height: 18,
                      borderRadius: 8,
                      backgroundColor: bg,
                      opacity,
                      transform: [{ translateY }, { scale }]
                    }}
                  />
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.welcomeButton}
              onPress={() => {
                setShowWelcomeModal(false);
                // Go to Home tab explicitly
                try { router.replace('/(tabs)'); } catch { router.back(); }
              }}
            >
              <Ionicons name="rocket" size={18} color="#ffffff" />
              <Text style={styles.welcomeButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, backgroundColor: "transparent" },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#d4af37" },
  headerTitleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#0b0b0f" },

  // Hero Cards
  heroCard: { borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, overflow: 'hidden' },
  currentPlanCard: { borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, overflow: 'hidden' },
  shimmerOverlay: { position: 'absolute', top: 0, bottom: 0, width: 180, opacity: 0.6 },
  vipBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#d4af37", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  vipBadgeText: { color: "#0b0b0f", fontWeight: "900", marginLeft: 6, fontSize: 12 },
  heroTitle: { color: "#f8fafc", fontSize: 20, fontWeight: "900", marginTop: 10 },
  heroSubtitle: { color: "#c7c9d1", fontSize: 13, marginTop: 6 },

  // Plan Details
  planDetails: { marginTop: 16, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#2b2b30" },
  planDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  planDetailLabel: { color: "#d1d5db", fontSize: 14, fontWeight: "600" },
  planDetailValue: { color: "#fff", fontSize: 14, fontWeight: "800" },

  // Benefits Section
  benefitsSection: { backgroundColor: "#0f0f13", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#2b2b30" },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#f8fafc", marginBottom: 10 },

  // Plan Cards
  planCard: { backgroundColor: "#0f0f13", borderRadius: 16, borderWidth: 1, borderColor: "#2b2b30", marginBottom: 12, position: "relative" },
  planCardExpanded: { borderColor: "#d4af37" },
  planHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  planName: { fontSize: 16, fontWeight: "900", color: "#f8fafc" },
  planDuration: { fontSize: 12, color: "#a1a1aa", marginTop: 2 },
  planPriceWrap: { alignItems: "flex-end", marginRight: 8 },
  priceWrap: { alignItems: 'flex-end' },
  planPrice: { fontSize: 18, fontWeight: "900", color: "#f8fafc" },
  strikedPrice: { fontSize: 12, color: "#a1a1aa", textDecorationLine: 'line-through', marginTop: 2, textAlign: 'right' },
  ribbon: { position: "absolute", top: -10, left: 16, backgroundColor: "#f59e0b", paddingHorizontal: 10, paddingVertical: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  ribbonText: { color: "#fff", fontWeight: "800", fontSize: 10 },
  planBody: { paddingHorizontal: 16, paddingBottom: 16 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  benefitText: { fontSize: 13, color: "#d1d5db" },
  ctaBtn: { marginTop: 14, height: 48, borderRadius: 12, backgroundColor: "#d4af37", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaText: { color: "#0b0b0f", fontWeight: "900" },

  // Cancel Button
  cancelBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: "#1f2937", borderWidth: 1, borderColor: "#374151", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  cancelBtnText: { color: "#e5e7eb", fontWeight: "800" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
  confirmModalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 360, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingModalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: "center", marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 20 },

  // Cancel Modal Styles
  cancelModalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 380, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
  cancelModalIconContainer: { alignItems: "center", marginBottom: 20 },
  cancelModalIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fecaca" },
  cancelModalTitle: { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 8 },
  cancelModalSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  cancelBenefitsWarning: { backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: "#fecaca" },
  cancelWarningTitle: { fontSize: 16, fontWeight: "700", color: "#dc2626", marginBottom: 12 },
  cancelBenefitItem: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  cancelBenefitText: { fontSize: 14, color: "#7f1d1d", fontWeight: "500" },
  cancelModalButtonContainer: { flexDirection: "row", gap: 12 },
  cancelModalButtonSecondary: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    backgroundColor: "#f8fafc", 
    alignItems: "center", 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 8, 
    borderWidth: 1, 
    borderColor: "#e2e8f0",
    minHeight: 48
  },
  cancelModalButtonSecondaryText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false
  },
  cancelModalButtonPrimary: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    backgroundColor: "#ef4444", 
    alignItems: "center", 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 8,
    minHeight: 48,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  cancelModalButtonPrimaryDisabled: { 
    backgroundColor: "#9ca3af", 
    opacity: 0.6,
    shadowOpacity: 0
  },
  cancelModalButtonPrimaryText: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#ffffff",
    textAlign: "center",
    includeFontPadding: false
  },

  // Reason Input Styles
  reasonInputContainer: { marginBottom: 20 },
  reasonInputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  reasonInput: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 12, fontSize: 14, color: "#111827", borderWidth: 1, borderColor: "#e5e7eb", minHeight: 80 },

  // Thank You Modal Styles
  thankYouModalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
  thankYouIconContainer: { alignItems: "center", marginBottom: 20 },
  thankYouIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#f0fdf4", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#bbf7d0" },
  thankYouTitle: { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 8 },
  thankYouSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  thankYouButton: { paddingVertical: 14, borderRadius: 12, backgroundColor: "#10b981", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  thankYouButtonText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Buttons
  modalButtonContainer: { flexDirection: "row", gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#f3f4f6", alignItems: "center" },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#f59e0b", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  loadingText: { fontSize: 16, fontWeight: "600", color: "#111827", marginTop: 12, textAlign: "center" },

  // Welcome Modal Styles
  welcomeModalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12, overflow: 'hidden' },
  welcomeHeader: { alignItems: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center' },
  welcomeSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 6 },
  celebrationStage: { height: 120, marginVertical: 10 },
  welcomeButton: { paddingVertical: 14, borderRadius: 12, backgroundColor: '#f59e0b', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10 },
  welcomeButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },

  // Coupon UI
  couponCard: { backgroundColor: 'transparent', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 0, borderColor: 'transparent' },
  couponHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  couponTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  couponInputContainer: { flex: 1, position: 'relative' },
  couponInput: { flex: 1, height: 44, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, color: '#111827', fontWeight: '600' },
  clearBtnInside: { position: 'absolute', right: 6, top: 6, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  applyBtn: { height: 44, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#0b0b0f', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#d4af37' },
  applyBtnText: { color: '#d4af37', fontWeight: '900' },
  couponError: { marginTop: 8, color: '#ef4444', fontSize: 12, fontWeight: '700' },
  couponSuccessRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  couponSuccessText: { color: '#065f46', fontSize: 12, fontWeight: '700' },
  couponHint: { marginTop: 8, color: '#6b7280', fontSize: 12 },

  // Coupon pill on VIP dashboard
  couponAppliedPill: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#bbf7d0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  couponAppliedText: { color: '#065f46', fontWeight: '800', fontSize: 12 },

  // Light strike for dashboard price
  strikedPriceLight: { fontSize: 12, color: '#e5e7eb', textDecorationLine: 'line-through' },

  // Gold gradient text for discounted price (no background)
  goldPriceTextOnly: { fontSize: 18, fontWeight: '900', color: '#b45309' },
});


