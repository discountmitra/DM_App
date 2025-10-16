import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ name?: string; phone?: string; date?: string } & { venue?: string; days?: string; eventType?: string }>({});

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
    setShowConfirmModal(true);
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
            <TouchableOpacity activeOpacity={0.85} style={styles.select}>
              <Text style={styles.selectText}>{venue}</Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>How many days</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.select}>
              <Text style={styles.selectText}>{days}</Text>
              <Ionicons name="chevron-down" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Event type</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.select}>
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
        <TouchableOpacity activeOpacity={0.85} style={styles.select} onPress={() => {
          // Keep minimal - date is typed for now to avoid extra modal complexity
        }}>
          <TextInput
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#6b7280"
            style={[styles.input, { paddingVertical: 0, height: 44 }]}
            value={eventDate}
            onChangeText={setEventDate}
          />
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
        <Text style={styles.submitText}>Submit Request</Text>
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
});


