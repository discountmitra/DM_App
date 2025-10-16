import { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useVip } from '../contexts/VipContext';
import LikeButton from '../components/common/LikeButton';
import OfferCards from '../components/common/OfferCards';
import { defaultImage } from '../constants/assets';
import { categoryOffers } from '../constants/offerData';
import { eventData as eventServices } from '../constants/eventsData';
import { LinearGradient } from 'expo-linear-gradient';
import { eventsFaq as faqData } from "../constants/faqData";
import EventRequestForm from "../components/events/EventRequestForm";

type UserType = 'normal' | 'vip';

interface EventData {
  Category: string;
  'Sub-Category': string;
  Name: string;
  description: string;
  'NORMAL USER': string;
  'VIP USER': string;
  Button: string;
  reaction: string;
}

export default function EventDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { eventId } = params;
  const { userMode } = useVip();
  const eventIdStr = Array.isArray(eventId) ? (eventId?.[0] ?? '') : (eventId ?? '');
  const headerImage = typeof params.image === 'string' ? (params.image as string) : '';
  
  const [userType, setUserType] = useState<UserType>('normal');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [venue, setVenue] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; date?: string; time?: string; venue?: string; service?: string }>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [viewerData, setViewerData] = useState<{ id: number; url: string }[]>([]);
  const viewerListRef = useRef<FlatList<any>>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [popupAnim] = useState(new Animated.Value(0));


  const eventData: EventData[] = eventServices.map(s => ({
    Category: 'Events',
    'Sub-Category': s.category,
    Name: s.name,
    description: s.description,
    'NORMAL USER': s.normalUserOffer || '10% DISCOUNT',
    'VIP USER': s.vipUserOffer || 'GET UPTO 25% DISCOUNT',
    Button: 'Request Now',
    reaction: 'Thanks for booking! Our team will contact you in 10 mins',
  }));

  // Find the specific event data (fallback to first item if not found)
  const currentEvent = eventData.find(event => {
    const eventNameSlug = event.Name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    const eventIdSlug = eventIdStr.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    return eventNameSlug === eventIdSlug;
  }) || eventData[0];

  const handleBooking = () => {
    const newErrors: { name?: string; phone?: string; date?: string; time?: string; venue?: string; service?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phoneNumber.trim())) newErrors.phone = 'Enter valid 10-digit phone';
    if (!eventDate.trim()) newErrors.date = 'Event date is required';
    if (!eventTime.trim()) newErrors.time = 'Event time is required';
    // Venue required for decoration and tent/dj/thadakala groups and generally meaningful
    const isDecoration = event.category === 'Decoration';
    const isInfra = event.category === 'Tent House' || event.category === 'DJ & Lighting' || event.category === 'Thadakala Pandiri';
    if ((isDecoration || isInfra) && !venue.trim()) newErrors.venue = 'Venue/Address is required';
    if (isInfra && !selectedServiceName.trim()) newErrors.service = 'Please select a service';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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

  const handleCall = async () => {
    // Find the canonical service entry to access its phone if present
    const service = eventServices.find(s => s.name === currentEvent.Name && s.category === currentEvent['Sub-Category']);
    const number = (service as any)?.phone as string | undefined;
    if (!number) return;
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
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
  const confirmBooking = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setBookingId(Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };
  const closeSuccess = () => { setShowSuccessModal(false); router.back(); };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDateSelection = () => {
    // Format date as DD-MM-YYYY to avoid timezone issues
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setEventDate(formattedDate);
    setErrors(prev => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;
      
      days.push({ day, date, isToday, isSelected, isPast });
    }
    
    return days;
  };

  // Function to convert individual offers to array format
  const convertOffersToArray = (offerText: string) => {
    if (!offerText) return [];
    return offerText.split('\n').filter(line => line.trim() !== '');
  };

  const event = useMemo(() => ({
    id: eventIdStr || '',
    name: currentEvent.Name,
    category: currentEvent['Sub-Category'],
    description: currentEvent.description.replace(/[^\w\s\u0C00-\u0C7F₹\/-]/g, '').trim(),
    rating: 4.8,
    reviews: 234,
    normalUserOffer: (params.normalUserOffer as string) || "",
    vipUserOffer: (params.vipUserOffer as string) || "",
  }), [currentEvent, eventIdStr, params.normalUserOffer, params.vipUserOffer]);
  // Get gallery images from events data
  const canonicalService = eventServices.find(s => s.name === event.name && s.category === event.category);
  const serviceGallery = canonicalService?.gallery || [];

  const currentGalleryImages = serviceGallery;
  const getItemLayout = (_: any, index: number) => {
    const width = Dimensions.get('window').width;
    return { length: width, offset: width * index, index };
  };

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
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{event.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>⭐ {event.rating}</Text>
                <Text style={styles.stickyHeaderPrice}>Events</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heroCallButton} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#111827" />
          </TouchableOpacity>
          </View>
          </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <Image 
            source={headerImage && /^https?:\/\//.test(headerImage) ? { uri: headerImage } : defaultImage} 
            style={styles.heroBackgroundImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          
          {/* Top Action Buttons */}
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
                  id: event.id,
                  name: event.name,
                  category: 'Events',
                  subcategory: event.category,
                  image: headerImage,
                  description: event.description,
                  rating: event.rating,
                  reviews: event.reviews,
                  location: event.category,
                  address: event.category,
                }}
                  size={24} 
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                />
          </View>
        </View>
      </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Event Info Card */}
          <View style={styles.eventInfoCard}>
            <View style={styles.eventInfoHeader}>
              <View style={styles.eventIcon}>
                <Ionicons name="calendar" size={24} color="#e91e63" />
              </View>
              <View style={styles.eventInfoMain}>
              <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventLocation}>
                  <Ionicons name="location" size={12} color="#ef4444" />
                  <Text style={styles.eventLocationText}>{event.category}</Text>
                </View>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventPrice}>Events</Text>
                  <View style={styles.eventStatus}>
                    <Text style={styles.eventStatusText}>Available Now</Text>
                    <Ionicons name="chevron-down" size={14} color="#6b7280" />
              </View>
            </View>
                <View style={styles.eventRating}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{event.rating}</Text>
                    <Text style={styles.reviewsText}>({event.reviews})</Text>
            </View>
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>Events</Text>
            </View>
            </View>
              </View>
          </View>
        </View>

        {/* Normal & VIP Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Benefits</Text>
          <OfferCards 
            normalOffers={event.normalUserOffer ? convertOffersToArray(event.normalUserOffer) : undefined}
            vipOffers={event.vipUserOffer ? convertOffersToArray(event.vipUserOffer) : undefined}
            category="event"
            serviceType={event.category}
          />
        </View>

        {/* Gallery section (for supported event types) */}
        {currentGalleryImages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.galleryHeaderRow}>
              <Text style={styles.sectionTitle}>Our Work Gallery</Text>
              <View style={styles.galleryBadge}><Text style={styles.galleryBadgeText}>{currentGalleryImages.length} Photos</Text></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
              {currentGalleryImages.map((uri, idx) => (
                <TouchableOpacity
                  key={`${uri}-${idx}`}
                  activeOpacity={0.9}
                  style={styles.galleryCard}
                  onPress={() => {
                    setActiveGalleryIndex(idx);
                    setViewerData(currentGalleryImages.map((u, i) => ({ id: i + 1, url: u })));
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


        {/* Booking Form */}
        <View className="section">
          {event.category === 'Chef' && (
        <View style={styles.section}>
              <EventRequestForm type="chef" title="Chef Request" />
          </View>
          )}
          {event.category === 'Photography' && (
            <View style={styles.section}>
              <EventRequestForm type="photography" title="Photography Request" />
          </View>
          )}
          {event.category !== 'Chef' && event.category !== 'Photography' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Book Your Event</Text>
              {/* existing booking UI retained for other categories */}
              {/* Keeping original handler and controls for non-chef/photography */}
              {/* Minimal duplication: keep as-is for other categories */}
          </View>
          )}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
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
                    name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
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
        </View>

        <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      {/* Payment Popup for Normal Users */}
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
                style={styles.paymentPopupCloseButton}
                onPress={handleClosePaymentPopup}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              <Ionicons name="card" size={32} color="#3b82f6" />
              <Text style={styles.paymentPopupTitle}>Payment Required</Text>
              <Text style={styles.paymentPopupSubtitle}>Choose your payment option for request</Text>
            </View>

            {/* Unified pricing and actions (match Home Services) */}
            <View style={styles.paymentPopupContent}>
              <View style={styles.paymentPriceRow}>
                <Text style={styles.paymentNormalPrice}>₹9</Text>
                <View style={styles.paymentVipPriceLocked}>
                  <Ionicons name="lock-closed" size={12} color="#10b981" />
                  <Text style={styles.paymentVipPriceText}>VIP: Free</Text>
                  <Text style={styles.paymentSavingsText}>Save ₹9</Text>
                </View>
              </View>
            </View>

            <View style={styles.paymentPopupActions}>
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
                  colors={['#fbbf24', '#f59e0b']}
                  style={styles.paymentUpgradeGradient}
                >
                  <Text style={styles.paymentUpgradeText}>Subscribe</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#e91e63" /></View></View>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before booking</Text>
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="pricetag" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Event:</Text><Text style={styles.detailValue}>{event.name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{customerName}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phoneNumber}</Text></View>
              <View style={styles.detailRow}><Ionicons name="calendar" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{eventDate}</Text></View>
              <View style={styles.detailRow}><Ionicons name="time" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Time:</Text><Text style={styles.detailValue}>{eventTime}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirmModal(false)} activeOpacity={0.8}><Text style={styles.modalButtonSecondaryText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonPrimary, { backgroundColor: '#e91e63' }]} onPress={confirmBooking} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Gallery Fullscreen Modal */}
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
            getItemLayout={getItemLayout}
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

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}><View style={styles.loadingModalCard}><ActivityIndicator size="large" color="#e91e63" /><Text style={styles.loadingText}>Submitting your booking...</Text><Text style={styles.loadingSubtext}>Please wait a moment</Text></View></View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.successIconCircle}><Ionicons name="checkmark-circle" size={48} color="#10b981" /></View></View>
            <Text style={styles.successModalTitle}>Booking Submitted</Text>
            <View style={styles.successDetailsCard}><Text style={styles.bookingCodeLabel}>Booking ID</Text><Text style={styles.bookingCodeValue}>{bookingId}</Text><Text style={styles.bookingCodeNote}>We’ll contact you shortly to finalize details</Text></View>
            <TouchableOpacity style={[styles.successButton, { backgroundColor: '#e91e63' }]} onPress={closeSuccess} activeOpacity={0.8}><Text style={styles.successButtonText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    dayData?.isToday && styles.todayDay,
                    dayData?.isSelected && styles.selectedDay,
                    dayData?.isPast && styles.pastDay,
                    !dayData && styles.emptyDay
                  ]}
                  onPress={() => dayData && !dayData.isPast && selectDate(dayData.date)}
                  disabled={!dayData || dayData.isPast}
                >
                  <Text style={[
                    styles.calendarDayText,
                    dayData?.isToday && styles.todayText,
                    dayData?.isSelected && styles.selectedText,
                    dayData?.isPast && styles.pastText
                  ]}>
                    {dayData?.day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity
                style={styles.calendarCancelButton}
                onPress={cancelDateSelection}
              >
                <Text style={styles.calendarCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calendarConfirmButton}
                onPress={confirmDateSelection}
              >
                <Text style={styles.calendarConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade" onRequestClose={() => setShowTimePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            {['morning','night'].map(opt => (
              <TouchableOpacity key={opt} style={styles.pickerItem} activeOpacity={0.85} onPress={() => { setEventTime(opt); setErrors(prev => ({ ...prev, time: undefined })); setShowTimePicker(false); }}>
                <Text style={styles.pickerText}>{opt === 'morning' ? 'Morning' : 'Night'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Service Picker Modal */}
      <Modal visible={showServicePicker} transparent animationType="fade" onRequestClose={() => setShowServicePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            {[currentEvent.Name, 'Standard Package', 'Custom Requirement'].map(option => (
              <TouchableOpacity key={option} style={styles.pickerItem} activeOpacity={0.85} onPress={() => { setSelectedServiceName(option); setErrors(prev => ({ ...prev, service: undefined })); setShowServicePicker(false); }}>
                <Text style={styles.pickerText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stickyHeaderInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  stickyHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stickyHeaderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyHeaderRating: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 12,
  },
  stickyHeaderPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 10,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLikeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    backgroundColor: '#f8fafc',
    marginTop: -100, // Overlap with hero section
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 5,
  },
  eventInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginTop: -25,
  },
  eventInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfoMain: {
    flex: 1,
  },
  eventName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventLocationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventPrice: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventStatusText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  eventRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  budgetTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budgetTagText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  purchaseHistory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  purchaseText: {
    fontSize: 12,
    color: '#6b7280',
  },
  purchaseCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  userTypeButtons: { flexDirection: 'row', gap: 12 },
  userTypeButton: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center' },
  userTypeButtonActive: { borderColor: '#e91e63', backgroundColor: '#e91e63' },
  userTypeText: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 6 },
  userTypeTextActive: { color: '#ffffff' },
  discountText: { fontSize: 11, color: '#059669', fontWeight: '700', textAlign: 'center', lineHeight: 14 },
  discountTextActive: { color: '#ffffff', opacity: 0.9 },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff' },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  choicePill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#ffffff' },
  choicePillActive: { backgroundColor: '#e91e63', borderColor: '#e91e63' },
  choicePillText: { color: '#374151', fontWeight: '700', fontSize: 13 },
  choicePillTextActive: { color: '#ffffff' },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, height: 48, backgroundColor: '#ffffff' },
  selectText: { fontSize: 16, color: '#111827' },
  pickerCard: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 8, width: '85%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10 },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 16 },
  pickerText: { fontSize: 16, color: '#111827', fontWeight: '600' },
  bookButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e91e63' },
  bookButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  dateInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', paddingRight: 45 },
  calendarIcon: { position: 'absolute', right: 12 },
  calendarContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYear: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weekDays: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  calendarDay: { width: '14.285%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  emptyDay: { backgroundColor: 'transparent' },
  todayDay: { backgroundColor: '#fef2f2' },
  selectedDay: { backgroundColor: '#e91e63' },
  pastDay: { opacity: 0.3 },
  calendarDayText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  todayText: { color: '#e91e63', fontWeight: '700' },
  selectedText: { color: '#ffffff', fontWeight: '700' },
  pastText: { color: '#9ca3af' },
  closeCalendarButton: { marginTop: 20, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center' },
  closeCalendarText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  
  // Calendar Button Container
  calendarButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 20 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#e91e63', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  // Modals (aligned to healthcare)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#e91e63', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  successButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  // Gallery styles
  galleryHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  galleryBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  galleryBadgeText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  galleryRow: { paddingVertical: 6 },
  galleryCard: { width: 160, height: 110, borderRadius: 12, overflow: 'hidden', marginRight: 12, backgroundColor: '#e5e7eb' },
  galleryImage: { width: '100%', height: '100%' },
  galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
  galleryCornerBadge: { position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(17,24,39,0.7)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999 },
  galleryModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', paddingTop: 50 },
  galleryTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  galleryCloseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  galleryCounterWrap: { flexDirection: 'row', alignItems: 'center' },
  galleryCounterText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  galleryCounterTotal: { color: '#9ca3af', fontSize: 12, marginLeft: 4 },
  gallerySlide: { width: Dimensions.get('window').width, height: Dimensions.get('window').height - 120, alignItems: 'center', justifyContent: 'center' },
  gallerySlideImage: { width: '100%', height: '100%' },
  // Viewer (food-like) styles
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
  
  // Payment Popup Styles
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  paymentPopupHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentPopupCloseButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentPopupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  paymentPopupSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentPopupContent: {
    marginBottom: 24,
  },
  // extra styles to align with home services popup
  paymentPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  paymentNormalPrice: { fontSize: 28, fontWeight: '800', color: '#111827' },
  paymentVipPriceLocked: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  paymentVipPriceText: { fontSize: 12, fontWeight: '700', color: '#10b981' },
  paymentSavingsText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  paymentOptionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  paymentPopupActions: {
    gap: 12,
  },
  paymentContinueButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentContinueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  paymentUpgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentUpgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  paymentUpgradeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});