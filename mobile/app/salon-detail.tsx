import { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, ActivityIndicator, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import LikeButton from "../components/common/LikeButton";
import OfferCards from "../components/common/OfferCards";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../contexts/AuthContext";
import bookingService from "../services/bookingService";

type UserType = 'normal' | 'vip';

interface ServicePrice {
  name: string;
  original: number;
  discounted: number;
  discount: number;
}



type Salon = {
  id: string;
  name: string;
  address: string;
  category: 'men' | 'women' | 'unisex';
  rating: number;
  reviews: number;
  image?: string;
  phone?: string;
};

export default function SalonDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { user, authState } = useAuth();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const id = String(params.id || "");
        const res = await fetch(`${BASE_URL}/salons/${id}`);
        if (res.status === 404) {
          const all = await fetch(`${BASE_URL}/salons`);
          const list = await all.json();
          const found = (list as any[]).find((s) => s.id === id) || null;
          if (alive) setSalon(found);
        } else if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        } else {
          const json = await res.json();
          if (alive) setSalon(json as Salon);
        }
      } catch (e: any) {
        if (alive) setLoadError(e?.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [params.id]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; services?: string; date?: string; time?: string }>({});
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [requestId, setRequestId] = useState("");
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [faqData, setFaqData] = useState<Array<{question: string; answer: string}>>([]);
  const [faqLoading, setFaqLoading] = useState(true);


  

  

  const handleBooking = () => {
    // Check authentication first
    if (!authState.isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please login to book an appointment",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") }
        ]
      );
      return;
    }

    const newErrors: { name?: string; phone?: string; services?: string; date?: string; time?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    
    if (!appointmentDate.trim()) newErrors.date = "Select appointment date";
    if (!appointmentTime.trim()) newErrors.time = "Select appointment time";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    
    try {
      // Generate request ID (same format as other categories)
      const requestId = Math.random().toString(36).slice(2, 8).toUpperCase();
      
      // Create booking data with proper structure
      const bookingData = {
        orderData: {
          userName,
          userPhone,
          address: salon?.address || "",
          preferredTime: `${appointmentDate} at ${appointmentTime}`,
          issueNotes: `Salon booking for ${salon?.name}`
        },
        serviceId: salon?.id || "",
        serviceName: salon?.name || "",
        serviceCategory: "Beauty & Salon",
        requestId,
        notes: `Salon booking for ${salon?.name} on ${appointmentDate} at ${appointmentTime}`
      };

      // Create booking using the service
      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        setRequestId(response.booking.requestId);
        setBookingCode(response.booking.requestId);
        setIsLoading(false);
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setIsLoading(false);
      Alert.alert(
        "Booking Failed",
        error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Clear form
    setUserName("");
    setUserPhone("");
    setAppointmentDate("");
    setAppointmentTime("");
    setErrors({});
    router.back();
  };

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
    setAppointmentDate(formattedDate);
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

  const handleCall = async () => {
    const number = salon?.phone as string | undefined;
    if (!number) return;
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
  };

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
  };

  // Fetch FAQ data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setFaqLoading(true);
        const res = await fetch(`${BASE_URL}/faq/salon`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setFaqData(json);
      } catch (e: any) {
        console.error('Failed to load FAQ:', e);
        if (alive) setFaqData([]);
      } finally {
        if (alive) setFaqLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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

  

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#b53471" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading salon...</Text>
      </View>
    );
  }

  if (!salon || loadError) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ marginTop: 12, color: '#111827', fontWeight: '700' }}>{loadError ? 'Failed to load salon' : 'Salon not found'}</Text>
        {!!loadError && <Text style={{ marginTop: 6, color: '#6b7280' }}>{loadError}</Text>}
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
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{salon.name}</Text>
              <View style={styles.stickyHeaderDetails}>
                <Text style={styles.stickyHeaderRating}>Beauty & Salon</Text>
                <Text style={styles.stickyHeaderPrice}>⭐ {salon.rating}</Text>
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
            source={salon.image && /^https?:\/\//.test(salon.image) ? { uri: salon.image } : { uri: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png" }} 
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
                  id: salon.id,
                  name: salon.name,
                  category: 'Beauty',
                  subcategory: 'Salon',
                  image: salon.image,
                  description: salon.address,
                  rating: salon.rating,
                  reviews: salon.reviews,
                  location: salon.address,
                  address: salon.address,
                }}
                size={24}
                style={[styles.heroLikeButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              />
            </View>
          </View>
        </View>
          
        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Salon Info Card */}
          <View style={styles.salonInfoCard}>
            <View style={styles.salonInfoHeader}>
              <View style={styles.salonIcon}>
                <Ionicons name="cut" size={24} color="#b53471" />
              </View>
              <View style={styles.salonInfoMain}>
              <Text style={styles.salonName}>{salon.name}</Text>
                <View style={styles.salonLocation}>
                  <Ionicons name="location" size={12} color="#ef4444" />
                  <Text style={styles.salonLocationText}>{salon.address}</Text>
                </View>
                <View style={styles.salonMeta}>
                  <Text style={styles.salonPrice}>Beauty & Salon</Text>
                  <View style={styles.salonStatus}>
                    <Text style={styles.salonStatusText}>Open Now</Text>
                    <Ionicons name="chevron-down" size={14} color="#6b7280" />
                  </View>
                </View>
                <View style={styles.salonRating}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.ratingText}>{salon.rating}</Text>
                    <Text style={styles.reviewsText}>({salon.reviews})</Text>
              </View>
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>Beauty & Salon</Text>
            </View>
            </View>
            </View>
          </View>
        </View>


        {/* Services selection temporarily removed */}

        {/* Normal & VIP Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Benefits</Text>
          <OfferCards 
            category="beauty"
            serviceType="Haircuts"
          />
        </View>

        {/* Booking Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Your Appointment</Text>
          
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput 
              value={userName} 
              onChangeText={setUserName} 
              placeholder="Full name" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              value={userPhone} 
              onChangeText={setUserPhone} 
              placeholder="10-digit mobile number" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Appointment Date</Text>
            <TouchableOpacity onPress={openDatePicker} style={styles.dateInputContainer}>
              <TextInput 
                value={appointmentDate} 
                placeholder="Select date" 
                placeholderTextColor="#9ca3af" 
                style={styles.dateInput}
                editable={false}
                pointerEvents="none"
              />
              <Ionicons name="calendar-outline" size={20} color="#6b7280" style={styles.calendarIcon} />
            </TouchableOpacity>
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Appointment Time</Text>
            <TextInput 
              value={appointmentTime} 
              onChangeText={setAppointmentTime} 
              placeholder="e.g., 10:00 AM" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>

        

          

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleBooking} 
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>
              {!authState.isAuthenticated 
                ? "Login to Book Appointment" 
                : user?.isVip 
                  ? "Book Now (Free)" 
                  : "Book Now (₹9)"
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
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
          )}
        </View>

        <View style={{ height: 24 }} />
        </View>
      </ScrollView>
      
      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthNavButton}>
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthNavButton}>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDaysContainer}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => {
                if (!dayData) {
                  return <View key={index} style={styles.emptyDay} />;
                }
                
                const { day, date, isToday, isSelected, isPast } = dayData;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isToday && styles.todayDay,
                      isSelected && styles.selectedDay,
                      isPast && styles.pastDay
                    ]}
                    onPress={() => !isPast && selectDate(date)}
                    disabled={isPast}
                  >
                    <Text style={[
                      styles.dayText,
                      isToday && styles.todayText,
                      isSelected && styles.selectedText,
                      isPast && styles.pastText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#b53471" />
              </View>
            </View>
            
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to book this appointment?</Text>
            
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Salon:</Text>
                <Text style={styles.detailValue}>{salon.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{userName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{userPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{appointmentDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>{appointmentTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="card" size={16} color="#6b53471" />
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={[styles.detailValue, { color: "#b53471", fontWeight: "700" }]}>
                  {user?.isVip ? "Free (VIP)" : "₹9"}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={confirmBooking}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Yes, Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#b53471" />
              <Text style={styles.loadingText}>Processing your booking...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we confirm your appointment</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>
            
            <Text style={styles.successModalTitle}>Booking Confirmed!</Text>
            <Text style={styles.successModalSubtitle}>Your appointment has been successfully booked</Text>
            
            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Request ID</Text>
                <Text style={styles.bookingCodeValue}>{requestId}</Text>
                <Text style={styles.bookingCodeNote}>Show this ID at the salon</Text>
              </View>
              
              <View style={styles.contactInfoCard}>
                <Ionicons name="time" size={20} color="#10b981" />
                <Text style={styles.contactInfoText}>Our team will contact you soon to confirm the appointment time</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.successButton}
              onPress={closeSuccessModal}
              activeOpacity={0.8}
            >
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
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  stickyHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  stickyHeaderInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  stickyHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stickyHeaderDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  stickyHeaderRating: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 12,
  },
  stickyHeaderPrice: {
    fontSize: 12,
    color: "#6b7280",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: "relative",
    overflow: "hidden",
  },
  heroBackgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroTopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 10,
  },
  heroRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLikeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  salonInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    marginTop: -25,
  },
  salonInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  salonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fdf2f8",
    alignItems: "center",
    justifyContent: "center",
  },
  salonInfoMain: {
    flex: 1,
  },
  salonName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  salonLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  salonLocationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  salonMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  salonPrice: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  salonStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  salonStatusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  salonRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  reviewsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  budgetTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budgetTagText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  purchaseHistory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  purchaseText: {
    fontSize: 12,
    color: "#6b7280",
  },
  purchaseCount: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  mainContent: {
    backgroundColor: "#f8fafc",
    marginTop: -100, // Overlap with hero section
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 5,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },
  userTypeButtons: { flexDirection: "row", gap: 12 },
  userTypeButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center" },
  userTypeButtonActive: { borderColor: "#b53471", backgroundColor: "#b53471" },
  userTypeText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  userTypeTextActive: { color: "#ffffff" },
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  categoryTitle: { marginLeft: 12, fontSize: 18, fontWeight: "700", color: "#111827" },
  serviceItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  serviceItemSelected: { borderColor: "#b53471", backgroundColor: "#fdf2f8" },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  serviceNameSelected: { color: "#b53471" },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  originalPrice: { fontSize: 14, color: "#9ca3af", textDecorationLine: "line-through" },
  discountedPrice: { fontSize: 16, fontWeight: "700", color: "#111827" },
  discountedPriceSelected: { color: "#b53471" },
  savings: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  checkboxSelected: { borderColor: "#b53471", backgroundColor: "#b53471" },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff" },
  dateInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  dateInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff", flex: 1, paddingRight: 40 },
  calendarIcon: { position: 'absolute', right: 12 },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  totalCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#f8fafc", borderRadius: 12, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  totalAmount: { fontSize: 20, fontWeight: "700", color: "#b53471" },
  bookButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#b53471" },
  bookButtonDisabled: { backgroundColor: "#d1d5db" },
  bookButtonText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },

  
  // Calendar Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  calendarModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYearText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  weekDaysContainer: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  emptyDay: { width: '14.285%', height: 40 },
  calendarDay: { width: '14.285%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  todayDay: { backgroundColor: '#fdf2f8' },
  selectedDay: { backgroundColor: '#b53471' },
  pastDay: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: '500', color: '#111827' },
  todayText: { color: '#b53471', fontWeight: '700' },
  selectedText: { color: '#ffffff', fontWeight: '700' },
  pastText: { color: '#9ca3af' },
  calendarButtonContainer: { flexDirection: 'row', gap: 10 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#b53471', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Professional Modal Styles
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fdf2f8', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#b53471', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  
  // Loading Modal
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  
  // Success Modal
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 },
  bookingCodeContainer: { alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#b53471', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  contactInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10 },
  contactInfoText: { fontSize: 13, color: '#15803d', marginLeft: 10, flex: 1, fontWeight: '500' },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});