import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed' | 'rewarded';
  joinDate: string;
  rewardAmount: string;
}

const mockReferrals: Referral[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    status: "rewarded",
    joinDate: "2024-01-10",
    rewardAmount: "$10.00"
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    status: "completed",
    joinDate: "2024-01-08",
    rewardAmount: "$10.00"
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    status: "pending",
    joinDate: "2024-01-05",
    rewardAmount: "$0.00"
  }
];

export default function ReferralsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [referralCode] = useState("JOSHUA2024");
  const [totalEarnings] = useState("$20.00");
  const [totalReferrals] = useState(3);

  const handleShareReferral = async () => {
    try {
      const message = `Join me on Discount Mithra! Use my referral code "${referralCode}" to get $5 off your first order. Download the app now!`;
      await Share.share({
        message: message,
        title: 'Join Discount Mithra with my referral code!'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const handleCopyCode = () => {
    // In a real app, you would use Clipboard.setString(referralCode)
    Alert.alert('Copied!', `Referral code "${referralCode}" copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'rewarded': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'rewarded': return 'gift-outline';
      default: return 'help-circle-outline';
    }
  };

  const renderReferralItem = ({ item }: { item: Referral }) => (
    <View style={styles.referralCard}>
      <View style={styles.referralHeader}>
        <View style={styles.referralInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.referralDetails}>
            <Text style={styles.referralName}>{item.name}</Text>
            <Text style={styles.referralEmail}>{item.email}</Text>
            <Text style={styles.joinDate}>Joined: {item.joinDate}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardLabel}>Reward Earned:</Text>
        <Text style={styles.rewardAmount}>{item.rewardAmount}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#3b82f6" />
          </View>
          <Text style={styles.statNumber}>{totalReferrals}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#10b981" />
          </View>
          <Text style={styles.statNumber}>{totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      {/* Referral Code Section */}
      <View style={styles.referralCodeContainer}>
        <Text style={styles.sectionTitle}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <View style={styles.codeDisplay}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Ionicons name="copy-outline" size={20} color="#3b82f6" />
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Share Referral Code</Text>
        </TouchableOpacity>
      </View>

      {/* How It Works */}
      <View style={styles.howItWorksContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Share your referral code with friends</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>They sign up using your code</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>You both get $5 reward when they make their first order</Text>
          </View>
        </View>
      </View>

      {/* Referral History */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Referral History</Text>
        {mockReferrals.length > 0 ? (
          mockReferrals.map((referral) => (
            <View key={referral.id}>
              {renderReferralItem({ item: referral })}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Referrals Yet</Text>
            <Text style={styles.emptySubtitle}>Start sharing your referral code to earn rewards!</Text>
          </View>
        )}
      </View>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsTitle}>Terms & Conditions</Text>
        <Text style={styles.termsText}>
          • Referral rewards are credited after the referred user completes their first order
        </Text>
        <Text style={styles.termsText}>
          • Rewards can be used as credit towards future orders
        </Text>
        <Text style={styles.termsText}>
          • Referral program is subject to terms and conditions
        </Text>
      </View>
    </ScrollView>
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  referralCodeContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  codeDisplay: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginLeft: 6,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  howItWorksContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  stepContainer: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginTop: 6,
  },
  historyContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  referralCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  referralHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  referralInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  referralDetails: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  referralEmail: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  joinDate: {
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
  rewardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  termsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 8,
  },
});
