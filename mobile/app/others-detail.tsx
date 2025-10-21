import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import bookingService from '../services/bookingService';
// FAQ data now fetched from backend API

export default function OthersDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { authState } = useAuth();
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const userMode = isVip ? 'vip' : 'normal';
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [popupAnim] = useState(new Animated.Value(0));

  // Form state
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    location: '',
    contactPhone: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});




  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = 'Please select a service type';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe your service needs';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please provide your location';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Please provide your contact number';
    } else if (!/^\d{10}$/.test(formData.contactPhone.trim())) {
      newErrors.contactPhone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRequest = () => {
    if (!validateForm()) return;

    // Check authentication
    if (!authState.isAuthenticated || !authState.user) {
      Alert.alert(
        'Login Required',
        'Please login to submit service requests. You can create an account or login with your existing phone number.',
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Login', onPress: () => router.push('/(auth)/login') }]
      );
      return;
    }

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

  const confirmRequest = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      // Generate a short request ID similar to other categories
      const generatedRequestId = Math.random().toString(36).slice(2, 8).toUpperCase();

      const bookingData = {
        serviceId: 'others-custom-service',
        serviceName: 'Custom Service Request',
        serviceCategory: 'Others',
        orderData: {
          serviceType: formData.serviceType,
          description: formData.description,
          location: formData.location,
          contactPhone: formData.contactPhone,
          additionalNotes: formData.additionalNotes,
        },
        requestId: generatedRequestId,
        notes: `Custom service request: ${formData.serviceType}`,
      };

      const result = await bookingService.createBooking(bookingData);
      // Prefer the generated ID to ensure immediate display
      setRequestId(generatedRequestId);
      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to submit request. Please try again.');
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      serviceType: '',
      description: '',
      location: '',
      contactPhone: '',
      additionalNotes: '',
    });
    setErrors({});
    router.back();
  };

  const onScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 100);
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
              <Text style={styles.stickyHeaderTitle} numberOfLines={1}>Custom Service Request</Text>
              <Text style={styles.stickyHeaderDetails}>Tell us what you need</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#6B46C1', '#8B5CF6']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroTopActions}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.heroBackButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="add-circle" size={48} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>Custom Service Request</Text>
              <Text style={styles.heroSubtitle}>
                Can't find what you're looking for? Tell us your specific needs and we'll find the perfect service provider for you.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Service Request Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            
            {/* Service Type */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Service Type *</Text>
              <TextInput
                value={formData.serviceType}
                onChangeText={(text) => handleInputChange('serviceType', text)}
                placeholder="e.g., Home Cleaning, Pet Care etc."
                placeholderTextColor="#9ca3af"
                style={[styles.input, errors.serviceType ? styles.inputError : null]}
              />
              {errors.serviceType && <Text style={styles.errorText}>{errors.serviceType}</Text>}
            </View>

            {/* Description */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Service Description *</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Describe your service needs in detail..."
                placeholderTextColor="#9ca3af"
                multiline
                style={[styles.textArea, errors.description ? styles.inputError : null]}
                textAlignVertical="top"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            {/* Location */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                placeholder="Enter your location or area"
                placeholderTextColor="#9ca3af"
                style={[styles.input, errors.location ? styles.inputError : null]}
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>



            {/* Contact Phone */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Contact Phone *</Text>
              <TextInput
                value={formData.contactPhone}
                onChangeText={(text) => {
                  const digits = text.replace(/\D/g, '');
                  if (digits.length <= 10) handleInputChange('contactPhone', digits);
                }}
                placeholder="10-digit mobile number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                style={[styles.input, errors.contactPhone ? styles.inputError : null]}
              />
              {errors.contactPhone && <Text style={styles.errorText}>{errors.contactPhone}</Text>}
            </View>

            {/* Additional Notes */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                value={formData.additionalNotes}
                onChangeText={(text) => handleInputChange('additionalNotes', text)}
                placeholder="Any specific requirements, timing, or preferences..."
                placeholderTextColor="#9ca3af"
                multiline
                style={styles.textArea}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {userMode === 'vip' ? 'Submit Request (Free)' : 'Submit Request (₹9)'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.noteText}>
              We'll find the best service providers for your needs and get back to you within 24 hours.
            </Text>
          </View>

          {/* How It Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Submit Your Request</Text>
                  <Text style={styles.stepDescription}>Tell us what service you need and your requirements</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>We Find Providers</Text>
                  <Text style={styles.stepDescription}>Our team searches for the best service providers in your area</Text>
                </View>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Get Quotes & Choose</Text>
                  <Text style={styles.stepDescription}>Receive multiple quotes and select the best option for you</Text>
                </View>
              </View>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              <View style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(0)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>How does custom service request work?</Text>
                  <Ionicons
                    name={expandedFAQ === 0 ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expandedFAQ === 0 && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>Simply fill out the form with your service requirements, and our team will find the best service providers for you within 24 hours.</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>What types of services can I request?</Text>
                  <Ionicons
                    name={expandedFAQ === 1 ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expandedFAQ === 1 && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>You can request any service that's not available in our main categories - from home cleaning to pet care, event planning to specialized repairs.</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(2)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>How much does it cost?</Text>
                  <Ionicons
                    name={expandedFAQ === 2 ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expandedFAQ === 2 && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>Normal users pay ₹9 per request, while VIP members get this service completely free as part of their subscription.</Text>
                  </View>
                )}
              </View>
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
                style={styles.paymentCloseButton}
                onPress={handleClosePaymentPopup}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              <Ionicons name="card" size={32} color="#3b82f6" />
              <Text style={styles.paymentPopupTitle}>Payment Required</Text>
              <Text style={styles.paymentPopupSubtitle}>
                Choose your payment option for custom service request
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
                <Ionicons name="help-circle" size={32} color="#6B46C1" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Submit Custom Request</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to submit this custom service request?
            </Text>

            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="construct" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Service Type:</Text>
                <Text style={styles.detailValue}>{formData.serviceType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{formData.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{formData.contactPhone}</Text>
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
                onPress={confirmRequest}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B46C1" />
              <Text style={styles.loadingText}>Processing your request...</Text>
              <Text style={styles.loadingSubtext}>
                Please wait while we process your custom service request
              </Text>
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

            <Text style={styles.successModalTitle}>Request Submitted!</Text>
            {requestId ? (
              <View style={styles.successDetailsCard}>
                <Text style={styles.bookingCodeLabel}>Request ID</Text>
                <Text style={styles.bookingCodeValue}>{requestId}</Text>
                <Text style={styles.bookingCodeNote}>Keep this code for reference</Text>
              </View>
            ) : null}

            <View style={styles.contactInfoCard}>
              <Ionicons name="time" size={20} color="#10b981" />
              <Text style={styles.contactInfoText}>
                Our team will contact you within 24 hours with service provider options
              </Text>
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 320,
    position: "relative",
    overflow: "hidden",
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  heroTopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mainContent: {
    backgroundColor: "#f8fafc",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  formRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#111827",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    height: 100,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#6B46C1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  noteText: {
    marginTop: 12,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6B46C1",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 12,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },
  faqAnswerContainer: {
    paddingTop: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  confirmModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconContainer: { alignItems: "center", marginBottom: 16 },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  bookingDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 6,
    marginRight: 8,
    minWidth: 65,
  },
  detailValue: { fontSize: 13, fontWeight: "600", color: "#111827", flex: 1 },
  modalButtonContainer: { flexDirection: "row", gap: 10 },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#6B46C1",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  loadingModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingContainer: { alignItems: "center" },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
  },
  successModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  successModalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  successDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  bookingCodeLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  bookingCodeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6B46C1",
    letterSpacing: 1,
    marginBottom: 6,
  },
  bookingCodeNote: { fontSize: 11, color: "#9ca3af", textAlign: "center" },
  contactInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 10,
  },
  contactInfoText: {
    fontSize: 13,
    color: "#15803d",
    marginLeft: 10,
    flex: 1,
    fontWeight: "500",
  },
  successButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  successButtonText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
});
