import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promotion' | 'system' | 'referral';
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order from ICE HOUSE has been confirmed and is being prepared.",
    time: "2 min ago",
    isRead: false,
    type: "order"
  },
  {
    id: "2",
    title: "Special Offer",
    message: "Get 20% off on your next order at Bella Vista. Use code SAVE20",
    time: "1 hour ago",
    isRead: true,
    type: "promotion"
  },
  {
    id: "3",
    title: "Referral Reward",
    message: "Congratulations! You earned $5 for referring Sarah Johnson.",
    time: "3 hours ago",
    isRead: true,
    type: "referral"
  },
  {
    id: "4",
    title: "App Update",
    message: "New features added! Check out the improved search and favorites.",
    time: "1 day ago",
    isRead: true,
    type: "system"
  },
  {
    id: "5",
    title: "Order Delivered",
    message: "Your order from Sushi Master has been delivered. Enjoy your meal!",
    time: "2 days ago",
    isRead: true,
    type: "order"
  }
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return 'bag-outline';
      case 'promotion': return 'gift-outline';
      case 'system': return 'settings-outline';
      case 'referral': return 'people-outline';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return '#3b82f6';
      case 'promotion': return '#f59e0b';
      case 'system': return '#6b7280';
      case 'referral': return '#10b981';
      default: return '#6b7280';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.notificationContent}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}>
          <Ionicons 
            name={getNotificationIcon(item.type)} 
            size={20} 
            color={getNotificationColor(item.type)} 
          />
        </View>
        
        <View style={styles.notificationText}>
          <Text style={[
            styles.notificationTitle,
            !item.isRead && styles.unreadText
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-outline" size={64} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! We'll notify you when something important happens.
      </Text>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* Notifications Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
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
    flexDirection: "row",
    alignItems: "center",
  },
  markAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
  settingsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
    fontWeight: "500",
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  countText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  clearAllText: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: "700",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginTop: 8,
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
    paddingHorizontal: 40,
  },
});
