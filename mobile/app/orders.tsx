import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  totalAmount: string;
  status: OrderStatus;
  orderDate: string;
  deliveryTime: string;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    restaurantName: "ICE HOUSE",
    items: ["Margherita Pizza", "Caesar Salad", "Coca Cola"],
    totalAmount: "$24.50",
    status: "delivered",
    orderDate: "2024-01-15",
    deliveryTime: "30 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
  },
  {
    id: "2",
    restaurantName: "Bella Vista",
    items: ["Chicken Burger", "French Fries"],
    totalAmount: "$18.75",
    status: "preparing",
    orderDate: "2024-01-14",
    deliveryTime: "25 min",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add"
  },
  {
    id: "3",
    restaurantName: "Sushi Master",
    items: ["California Roll", "Miso Soup", "Green Tea"],
    totalAmount: "$32.00",
    status: "ready",
    orderDate: "2024-01-13",
    deliveryTime: "20 min",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351"
  }
];

export default function OrdersScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const statusOptions: { key: OrderStatus | 'all'; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: '#6b7280' },
    { key: 'pending', label: 'Pending', color: '#f59e0b' },
    { key: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { key: 'preparing', label: 'Preparing', color: '#8b5cf6' },
    { key: 'ready', label: 'Ready', color: '#10b981' },
    { key: 'delivered', label: 'Delivered', color: '#059669' },
    { key: 'cancelled', label: 'Cancelled', color: '#dc2626' },
  ];

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filterStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'preparing': return 'restaurant-outline';
      case 'ready': return 'checkmark-done-outline';
      case 'delivered': return 'bicycle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'time-outline';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.9}>
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName}>{item.restaurantName}</Text>
            <Text style={styles.orderDate}>Ordered on {item.orderDate}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusOptions.find(s => s.key === item.status)?.color + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={statusOptions.find(s => s.key === item.status)?.color} 
          />
          <Text style={[styles.statusText, { color: statusOptions.find(s => s.key === item.status)?.color }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsTitle}>Items:</Text>
        {item.items.map((itemName, index) => (
          <Text key={index} style={styles.itemName}>• {itemName}</Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.deliveryText}>Est. {item.deliveryTime}</Text>
        </View>
        <Text style={styles.totalAmount}>{item.totalAmount}</Text>
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Reorder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bag-outline" size={64} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        {filterStatus === 'all' 
          ? "Start ordering from your favorite restaurants!"
          : `No ${filterStatus} orders found.`
        }
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.exploreButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
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

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={statusOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === item.key && styles.filterChipActive,
                { borderColor: item.color }
              ]}
              onPress={() => setFilterStatus(item.key)}
            >
              <Text style={[
                styles.filterChipText,
                filterStatus === item.key && styles.filterChipTextActive,
                { color: filterStatus === item.key ? '#fff' : item.color }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>

      {/* Orders Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          {filterStatus !== 'all' && ` (${filterStatus})`}
        </Text>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
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
  orderItems: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  orderActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  primaryButtonText: {
    color: "#fff",
  },
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
});
