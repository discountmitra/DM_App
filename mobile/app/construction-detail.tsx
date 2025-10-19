import { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal, ActivityIndicator, Animated, TouchableWithoutFeedback, Dimensions, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import LikeButton from '../components/common/LikeButton';
import OfferCards from '../components/common/OfferCards';
import { BASE_URL } from '../constants/api';
// FAQ data now fetched from backend API
// Gallery images now come from database
import { SafeAreaView } from 'react-native-safe-area-context';

type ConstructionData = {
  category: string;
  name: string;
  description: string;
  price?: string;
  details?: string;
  rating: number;
  reviews: number;
  availability: string;
  image?: string;
  normalUserOffer?: string;
  vipUserOffer?: string;
  phone?: string;
  gallery?: string[];
};

export default function ConstructionDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { authState } = useAuth();
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const userMode = isVip ? 'vip' : 'normal';
  const { constructionId } = params as { constructionId: string };
  const headerImage = typeof params.image === 'string' ? (params.image as string) : '';

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; quantity?: string }>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [popupAnim] = useState(new Animated.Value(0));
  const [faqData, setFaqData] = useState<Array<{question: string; answer: string}>>([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [viewerData, setViewerData] = useState<{ id: number; url: string }[]>([]);
  const viewerListRef = useRef<FlatList<any>>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const onScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowStickyHeader(y > 100);
  };

  const [service, setService] = useState<(ConstructionData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/construction/${encodeURIComponent(String(constructionId))}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setService(json);
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [constructionId]);

  // Fetch FAQ data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setFaqLoading(true);
        const res = await fetch(`${BASE_URL}/faq/construction`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setFaqData(json);
      } catch (e: any) {
        // Silently handle FAQ loading errors - not critical for app functionality
        if (alive) setFaqData([]);
      } finally {
        if (alive) setFaqLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);


  const current = useMemo(() => {
    if (!service) return null;
    return {
      id: service.id,
      category: service.category,
      name: service.name,
      description: service.description,
      price: service.price,
      details: service.details,
      rating: service.rating,
      reviews: service.reviews,
      availability: service.availability,
      image: service.image,
      normalUserOffer: (params.normalUserOffer as string) || service.normalUserOffer || "",
      vipUserOffer: (params.vipUserOffer as string) || service.vipUserOffer || "",
      phone: service.phone,
      gallery: service.gallery || [],
    };
  }, [service, params.normalUserOffer, params.vipUserOffer]);

  const displayImage = headerImage || current?.image || "";

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; quantity?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phoneNumber.trim())) newErrors.phone = 'Enter valid 10-digit phone';
    
    // Add quantity validation for bricks type
    if (current?.category === 'Bricks') {
      if (!quantity.trim()) newErrors.quantity = 'Quantity is required';
      else if (!/^\d+$/.test(quantity.trim())) newErrors.quantity = 'Enter valid number';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    // Show payment popup for normal users, confirmation modal for VIP users
    if (userMode === 'normal') {
      setShowPaymentPopup(true);
      Animated.spring(popupAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleClosePaymentPopup = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPaymentPopup(false);
    });
  };

  const handleContinueWithPayment = () => {
    handleClosePaymentPopup();
    setShowConfirmModal(true);
  };

  const handleUpgradeToVip = () => {
    handleClosePaymentPopup();
    router.push('/vip-subscription');
  };

  const confirmRequest = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setShowSuccessModal(true); }, 1200);
  };

  const handleCall = async () => {
    const number = current?.phone as string | undefined;
    if (!number) return;
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
  };

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator style={{ marginTop: 40 }} color="#f97316" />
    </View>
  );
  
  if (error || !current) return (
    <View style={styles.container}>
      <Text style={{ marginTop: 40, textAlign: 'center', color: '#6b7280' }}>
        {error || 'Not found'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <View style={styles.stickyHeaderContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.stickyHeaderInfo}>
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{current.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>⭐ {current.rating.toFixed(1)}</Text>
                <Text style={styles.stickyHeaderPrice}>{current.availability}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image
            source={displayImage && /^https?:\/\//.test(displayImage) ? { uri: displayImage } : { uri: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png" }}
            style={styles.heroBackgroundImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.heroBackButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroRightActions}>
              <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#111827" />
              </TouchableOpacity>
              <LikeButton 
                item={{
                  id: current.id,
                  name: current.name,
                  category: 'Construction',
                  subcategory: current.category,
                  image: displayImage,
                  description: current.description,
                  price: current.price || '',
                  rating: current.rating,
                  reviews: current.reviews,
                  location: current.category,
                  address: current.category,
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIcon}>
                <Ionicons name="construct" size={24} color="#f97316" />
              </View>
              <View style={styles.infoMain}>
                <Text style={styles.itemName}>{current.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="pricetag" size={12} color="#ef4444" />
                  <Text style={styles.locationText}>{current.category}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.priceText}>{current.price || 'Contact for Quote'}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusText}>{current.availability}</Text>
                    <Ionicons name="chevron-down" size={14} color="#6b7280" />
                  </View>
                </View>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{current.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewsText}>({current.reviews})</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Best Price</Text>
                  </View>
                </View>
              </View>
            </View>
            {current.details && <Text style={styles.descText}>{current.details}</Text>}
            <Text style={styles.descText}>{current.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers & Benefits</Text>
            <OfferCards 
              category="construction"
              serviceType={current.category}
            />
          </View>

          {current.id === 'interior-design' && current.gallery && current.gallery.length > 0 && (
            <View style={styles.section}>
              <View style={styles.galleryHeaderRow}>
                <Text style={styles.sectionTitle}>Our Work Gallery</Text>
                <View style={styles.galleryBadge}><Text style={styles.galleryBadgeText}>{current.gallery.length} Photos</Text></View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {current.gallery.map((uri, idx) => (
                  <TouchableOpacity
                    key={`${uri}-${idx}`}
                    activeOpacity={0.9}
                    style={styles.galleryCard}
                    onPress={() => {
                      setActiveGalleryIndex(idx);
                      setViewerData(current.gallery?.map((u, i) => ({ id: i + 1, url: u })) || []);
                      setShowGalleryModal(true);
                    }}
                  >
                    <Image source={{ uri }} style={styles.galleryImage} resizeMode="cover" />
                    <View style={styles.galleryOverlay} />
                    <View style={styles.galleryCornerBadge}>
                      <Ionicons name="expand" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Request Quote</Text>
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput value={customerName} onChangeText={setCustomerName} placeholder="Full name" placeholderTextColor="#9ca3af" style={styles.input} />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="10-digit mobile number" placeholderTextColor="#9ca3af" style={styles.input} keyboardType="numeric" />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
            {current.category === 'Bricks' && (
              <View style={styles.formRow}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput value={quantity} onChangeText={setQuantity} placeholder="Enter quantity (numbers only)" placeholderTextColor="#9ca3af" style={styles.input} keyboardType="numeric" />
                {errors.quantity ? <Text style={styles.errorText}>{errors.quantity}</Text> : null}
              </View>
            )}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder="Tell us your requirement..." placeholderTextColor="#9ca3af" style={[styles.input, styles.textArea]} multiline numberOfLines={4} />
            </View>
            <TouchableOpacity activeOpacity={0.9} onPress={handleRequest} style={styles.requestButton}>
              <Text style={styles.requestButtonText}>
                {userMode === 'vip' ? 'Request Now (Free)' : 'Request Now (₹9)'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading FAQs...</Text>
              </View>
            ) : (
              <View style={styles.faqList}>
                {faqData.map((faq, index) => (
                  <View key={index} style={styles.faqItem}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleFAQ(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Ionicons
                        name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                    {expandedFAQ === index && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#e91e63" />
            <Text style={styles.loadingText}>Submitting request...</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showGalleryModal} animationType="fade" transparent={false} onRequestClose={() => setShowGalleryModal(false)}>
        <SafeAreaView style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <TouchableOpacity style={styles.viewerBackButton} onPress={() => setShowGalleryModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.viewerTitleWrap}>
              <Text style={styles.viewerTitle} numberOfLines={1}>Gallery</Text>
              <Text style={styles.viewerCounter}>{activeGalleryIndex + 1} / {viewerData.length}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            ref={viewerListRef}
            data={viewerData}
            keyExtractor={(item) => String(item.id)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeGalleryIndex}
            getItemLayout={(_, index) => { const width = Dimensions.get('window').width; return { length: width, offset: width * index, index }; }}
            onMomentumScrollEnd={(e) => {
              const { width } = Dimensions.get('window');
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveGalleryIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.viewerSlide}>
                <Image source={{ uri: item.url }} style={styles.viewerImage} resizeMode="contain" />
              </View>
            )}
          />

          <View style={styles.viewerCaptionWrap}>
            <Text style={styles.viewerCaption} numberOfLines={1}>Photo</Text>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#f97316" /></View></View>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before submitting</Text>
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="briefcase" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Service:</Text><Text style={styles.detailValue}>{current.name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{customerName}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phoneNumber}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirmModal(false)} activeOpacity={0.8}><Text style={styles.modalButtonSecondaryText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={confirmRequest} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showPaymentPopup && (
        <View style={styles.paymentPopupOverlay}>
          <TouchableWithoutFeedback onPress={handleClosePaymentPopup}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.paymentPopupContainer,
              {
                transform: [
                  {
                    scale: popupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: popupAnim,
              },
            ]}
          >
            <View style={styles.paymentPopupHeader}>
              <TouchableOpacity 
                style={styles.paymentCloseButton}
                onPress={handleClosePaymentPopup}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              <Ionicons name="card" size={32} color="#3b82f6" />
              <Text style={styles.paymentPopupTitle}>Payment Required</Text>
              <Text style={styles.paymentPopupSubtitle}>
                Choose your payment option for request
              </Text>
            </View>

            <View style={styles.paymentPricingInfo}>
              <View style={styles.paymentPriceRow}>
                <Text style={styles.paymentNormalPrice}>₹9</Text>
                <View style={styles.paymentVipPriceLocked}>
                  <Ionicons name="lock-closed" size={12} color="#9ca3af" />
                  <Text style={styles.paymentVipPriceText}>VIP: Free</Text>
                  <Text style={styles.paymentSavingsText}>Save ₹9</Text>
                </View>
              </View>
            </View>

            <View style={styles.paymentPopupButtons}>
              <TouchableOpacity 
                style={styles.paymentContinueButton} 
                onPress={handleContinueWithPayment}
              >
                <Text style={styles.paymentContinueText}>Continue with ₹9</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.paymentUpgradeButton} 
                onPress={handleUpgradeToVip}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.paymentUpgradeGradient}
                >
                  <Ionicons name="star" size={18} color="#fff" />
                  <Text style={styles.paymentUpgradeText}>Subscribe</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => { setShowSuccessModal(false); router.back(); }}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}><Ionicons name="checkmark-circle" size={48} color="#10b981" /></View>
            <Text style={styles.successTitle}>Request Submitted</Text>
            <Text style={styles.successNote}>We’ll contact you shortly with the best quote</Text>
            <TouchableOpacity style={styles.successButton} onPress={() => { setShowSuccessModal(false); router.back(); }}>
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
  stickyHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stickyHeaderDetails: { flexDirection: 'row', alignItems: 'center' },
  stickyHeaderRating: { fontSize: 12, color: '#6b7280', marginRight: 12 },
  stickyHeaderPrice: { fontSize: 12, color: '#6b7280' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  heroSection: { height: 300, position: 'relative', overflow: 'hidden' },
  heroBackgroundImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  heroTopActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, zIndex: 10 },
  heroBackButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroRightActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroCallButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  heroLikeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  mainContent: { backgroundColor: '#f8fafc', marginTop: -100, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 20, zIndex: 5 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 4, marginTop: -25 },
  infoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  infoMain: { flex: 1 },
  itemName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: 14, color: '#6b7280', marginLeft: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priceText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  reviewsText: { fontSize: 12, color: '#6b7280' },
  tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  descText: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginTop: 8 },
  section: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 12, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 1 }, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff' },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  requestButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f97316' },
  requestButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f97316', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, alignItems: 'center' },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 },
  successNote: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 14 },
  successButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#f97316', width: '100%' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },

  galleryHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  galleryBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  galleryBadgeText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  galleryRow: { paddingVertical: 6 },
  galleryCard: { width: 160, height: 110, borderRadius: 12, overflow: 'hidden', marginRight: 12, backgroundColor: '#e5e7eb' },
  galleryImage: { width: '100%', height: '100%' },
  galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
  galleryCornerBadge: { position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(17,24,39,0.7)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999 },
  viewerContainer: { flex: 1, backgroundColor: '#000' },
  viewerHeader: { height: 56, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewerBackButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  viewerTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  viewerCounter: { color: '#9ca3af', fontSize: 12 },
  viewerSlide: { width: Dimensions.get('window').width, height: Dimensions.get('window').height - 160, alignItems: 'center', justifyContent: 'center' },
  viewerImage: { width: '100%', height: '100%' },
  viewerCaptionWrap: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' },
  viewerCaption: { color: '#e5e7eb', fontSize: 12 },
  paymentPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  paymentPopupContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  paymentPopupHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  paymentCloseButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  paymentPopupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 6,
  },
  paymentPopupSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentPricingInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentNormalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  paymentVipPriceLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  paymentVipPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  paymentSavingsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  paymentPopupButtons: {
    gap: 12,
  },
  paymentContinueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  paymentContinueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  paymentUpgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentUpgradeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paymentUpgradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
});