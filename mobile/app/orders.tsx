import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import bookingService from "../services/bookingService";
import { useAuth } from "../contexts/AuthContext";
type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface BookingItem {
  id: string;
  serviceName: string;
  serviceCategory: string;
  requestId: string;
  amountPaid: number;
  bookingDate: string; // ISO string
  status: BookingStatus;
  paymentStatus?: string;
}

export default function OrdersScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const statusColor: Record<BookingStatus, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    in_progress: '#8b5cf6',
    completed: '#059669',
    cancelled: '#dc2626',
  };

  useEffect(() => {
    // hide native header if any
    // @ts-ignore
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!authState.isAuthenticated) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await bookingService.getMyBookings();
        const list = (res?.bookings || res || []) as BookingItem[];
        const sorted = list.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
        setBookings(sorted);
      } catch (e: any) {
        setError(e?.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [authState.isAuthenticated]);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'in_progress': return 'construct-outline';
      case 'completed': return 'checkmark-done-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'time-outline';
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const renderBookingItem = ({ item }: { item: BookingItem }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{item.serviceName}</Text>
          <Text style={styles.orderDate}>{item.serviceCategory} • {formatDate(item.bookingDate)}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Request ID</Text>
        <Text style={styles.metaValue}>{item.requestId}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Amount Paid</Text>
        <Text style={styles.metaValue}>{item.amountPaid === 0 ? 'Free' : `₹${item.amountPaid}`}</Text>
      </View>

      {item.paymentStatus ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Payment</Text>
          <Text style={styles.metaValue}>{item.paymentStatus}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>{authState.isAuthenticated ? 'No Bookings Yet' : 'Login to view your bookings'}</Text>
      <Text style={styles.emptySubtitle}>
        {authState.isAuthenticated
          ? 'Your bookings from Home Services, Events, Construction, Salon and Others will appear here.'
          : 'Please login to sync your booking history across devices.'}
      </Text>
      {!authState.isAuthenticated ? (
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.exploreButtonText}>Login</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters removed intentionally */}

      {/* Bookings Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </Text>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Ionicons name="sync" size={20} color="#6b7280" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      )}

      {!!error && (
        <View style={styles.errorBar}>
          <Ionicons name="alert-circle" size={16} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 12,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: "#111827",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  countText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metaLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  metaValue: { fontSize: 14, color: '#111827', fontWeight: '700' },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff' },
  loadingText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  errorBar: { position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { color: '#dc2626', fontSize: 12, fontWeight: '600' },
});
