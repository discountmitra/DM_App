import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

type CommonProps = {
  title: string;
};

type ChefConfig = {
  type: 'chef';
};

type PhotographyConfig = {
  type: 'photography';
};

type Props = CommonProps & (ChefConfig | PhotographyConfig);

export default function EventRequestForm(props: Props) {
  const { authState } = useAuth();
  
  // Determine user mode based on authentication
  const isVip = authState.user?.isVip || false;
  const userMode = isVip ? 'vip' : 'normal';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Chef specific
  const VENUE_TYPES = ['Home', 'Function hall'];
  const DAYS = ['1','2','3','4','5'];
  const [venue, setVenue] = useState(VENUE_TYPES[0]);
  const [days, setDays] = useState(DAYS[0]);

  // Photography specific
  const EVENT_TYPES = ['Birthday','Saree function','21day','Wedding','Function','Event','Photoshoot'];
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [budget, setBudget] = useState('');

  // Shared calendar state
  const [eventDate, setEventDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [popupAnim] = useState(new Animated.Value(0));

  const [errors, setErrors] = useState<{ name?: string; phone?: string; date?: string } & { venue?: string; days?: string; eventType?: string }>({});

  // Dropdown picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<null | 'venue' | 'days' | 'eventType'>(null);
  const pickerOptions = useMemo(() => {
    if (pickerType === 'venue') return VENUE_TYPES;
    if (pickerType === 'days') return DAYS;
    if (pickerType === 'eventType') return EVENT_TYPES;
    return [];
  }, [pickerType]);

  const openPicker = (type: 'venue' | 'days' | 'eventType') => {
    setPickerType(type);
    setPickerOpen(true);
  };
  const closePicker = () => {
    setPickerOpen(false);
    setPickerType(null);
  };

  const canSubmit = () => {
    const hasName = name.trim().length > 0;
    const validPhone = /^\d{10}$/.test(phone.trim());
    const hasDate = eventDate.trim().length > 0;
    if (props.type === 'chef') {
      return hasName && validPhone && hasDate;
    }
    return hasName && validPhone && hasDate; // photography
  };

  const handleSubmit = () => {
    const nextErrors: typeof errors = {} as any;
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phone.trim())) nextErrors.phone = 'Enter valid 10-digit phone';
    if (!eventDate.trim()) nextErrors.date = 'Event date is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

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

  // Calendar utilities
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (null | { day: number; date: Date; isToday: boolean; isSelected: boolean; isPast: boolean })[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      days.push({ day: d, date, isToday, isSelected, isPast });
    }
    return days;
  };

  const confirmDateSelection = () => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    setEventDate(`${day}-${month}-${year}`);
    setErrors(prev => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setRequestCode(Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
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
    // Navigate to VIP subscription - you might need to add router import
    // router.push('/vip-subscription');
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>{props.title}</Text>

      <View style={styles.formRow}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#6b7280"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.formRow}>
        <Text style={styles.inputLabel}>Phone number</Text>
        <TextInput
          placeholder="10-digit phone"
          placeholderTextColor="#6b7280"
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
      </View>

      {props.type === 'chef' ? (
        <>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Event type</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.select} onPress={() => openPicker('venue')}>
              <Text style={styles.selectText}>{venue}</Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>How many days</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.select} onPress={() => openPicker('days')}>
              <Text style={styles.selectText}>{days}</Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Event type</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.select} onPress={() => openPicker('eventType')}>
              <Text style={styles.selectText}>{eventType}</Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Budget</Text>
            <TextInput
              placeholder="Approximate budget"
              placeholderTextColor="#6b7280"
              keyboardType="number-pad"
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
            />
          </View>
        </>
      )}

      <View style={styles.formRow}>
        <Text style={styles.inputLabel}>Event date</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.select} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.selectText}>{eventDate || 'DD-MM-YYYY'}</Text>
          <Ionicons name="calendar" size={18} color="#374151" />
        </TouchableOpacity>
        {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.submitButton, !canSubmit() && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={!canSubmit()}
      >
        <Text style={styles.submitText}>
          {userMode === 'vip' ? 'Request Now (Free)' : 'Request Now (₹9)'}
        </Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#e91e63" /></View></View>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before submitting</Text>
            <View style={styles.requestDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phone}</Text></View>
              {props.type === 'chef' ? (
                <>
                  <View style={styles.detailRow}><Ionicons name="home" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Venue:</Text><Text style={styles.detailValue}>{venue}</Text></View>
                  <View style={styles.detailRow}><Ionicons name="time" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Days:</Text><Text style={styles.detailValue}>{days}</Text></View>
                </>
              ) : (
                <>
                  <View style={styles.detailRow}><Ionicons name="camera" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Type:</Text><Text style={styles.detailValue}>{eventType}</Text></View>
                  {budget ? (<View style={styles.detailRow}><Ionicons name="cash" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Budget:</Text><Text style={styles.detailValue}>{budget}</Text></View>) : null}
                </>
              )}
              <View style={styles.detailRow}><Ionicons name="calendar" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{eventDate}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowConfirmModal(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmSubmit}><Text style={styles.modalConfirmText}>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}><View style={styles.loadingCard}><ActivityIndicator size="large" color="#e91e63" /><Text style={{ marginTop: 12, color: '#374151' }}>Submitting...</Text></View></View>
      </Modal>

      {/* Success Modal */}
      {/* Picker Modal - simple list without header/actions */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={closePicker}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            {pickerOptions.map((opt) => (
              <TouchableOpacity
                key={String(opt)}
                style={styles.pickerItem}
                activeOpacity={0.85}
                onPress={() => {
                  if (pickerType === 'venue') setVenue(String(opt));
                  if (pickerType === 'days') setDays(String(opt));
                  if (pickerType === 'eventType') setEventType(String(opt));
                  closePicker();
                }}
              >
                <Text style={styles.pickerText}>{String(opt)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={{ padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={{ padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' }}>
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 6 }}>{d}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
              {generateCalendarDays().map((dayData, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{ width: '14.285%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: dayData?.isSelected ? '#e91e63' : dayData?.isToday ? '#fef2f2' : 'transparent', opacity: dayData?.isPast ? 0.3 : 1 }}
                  onPress={() => dayData && !dayData.isPast && setSelectedDate(dayData.date)}
                  disabled={!dayData || dayData.isPast}
                >
                  <Text style={{ fontSize: 14, fontWeight: dayData?.isSelected ? '700' : '500', color: dayData?.isSelected ? '#ffffff' : '#374151' }}>{dayData?.day || ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDatePicker(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmDateSelection}><Text style={styles.modalConfirmText}>Done</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}><View style={[styles.modalIconCircle,{ backgroundColor: '#10b98122', borderColor: '#10b981' }]}><Ionicons name="checkmark-circle" size={32} color="#10b981" /></View></View>
            <Text style={styles.modalTitle}>Request Submitted</Text>
            <Text style={styles.modalSubtitle}>Your request has been placed successfully</Text>
            {requestCode ? <Text style={{ marginTop: 6, fontWeight: '700', color: '#111827' }}>Ref: {requestCode}</Text> : null}
            <TouchableOpacity style={[styles.modalConfirmButton,{ marginTop: 14 }]} onPress={closeSuccess}><Text style={styles.modalConfirmText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  formRow: { marginBottom: 14 },
  inputLabel: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#fff', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, color: '#111827', fontSize: 15 },
  select: { backgroundColor: '#fff', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  selectText: { color: '#111827', fontSize: 15, fontWeight: '600' },
  submitButton: { marginTop: 8, backgroundColor: '#111827', height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: '700' },
  // Modals shared styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  confirmModalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  successModalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center' },
  loadingCard: { width: '70%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalIconContainer: { alignItems: 'center', marginBottom: 8 },
  modalIconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#e91e63', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fde7ef' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginTop: 4 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  requestDetailsCard: { marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { marginLeft: 6, color: '#6b7280', fontSize: 12 },
  detailValue: { marginLeft: 6, color: '#111827', fontWeight: '600', fontSize: 12 },
  modalButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 12 },
  modalCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center' },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 0, borderWidth: 0, backgroundColor: 'transparent' },
  pickerText: { fontSize: 16, color: '#111827', fontWeight: '600' },
  
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
});


