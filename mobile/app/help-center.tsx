import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "1",
    title: "Account & Profile",
    icon: "person-outline",
    color: "#3b82f6",
    description: "Manage your account settings and profile information"
  },
  {
    id: "2",
    title: "Orders & Delivery",
    icon: "bag-outline",
    color: "#10b981",
    description: "Track orders, delivery issues, and order management"
  },
  {
    id: "3",
    title: "Payments & Billing",
    icon: "card-outline",
    color: "#f59e0b",
    description: "Payment methods, billing, and refunds"
  },
  {
    id: "4",
    title: "App Features",
    icon: "phone-portrait-outline",
    color: "#8b5cf6",
    description: "How to use app features and functionality"
  },
  {
    id: "5",
    title: "Technical Support",
    icon: "settings-outline",
    color: "#6b7280",
    description: "App issues, bugs, and technical problems"
  }
];

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "How do I place an order?",
    answer: "To place an order, browse restaurants, select items, add them to cart, and proceed to checkout. You can pay using various payment methods including cards, digital wallets, or cash on delivery.",
    category: "Orders & Delivery"
  },
  {
    id: "2",
    question: "How can I track my order?",
    answer: "Once your order is confirmed, you'll receive real-time updates. You can track your order status in the 'Orders' section of your profile or through push notifications.",
    category: "Orders & Delivery"
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), UPI, and cash on delivery for select restaurants.",
    category: "Payments & Billing"
  },
  {
    id: "4",
    question: "How do I update my profile information?",
    answer: "Go to Profile > Edit Profile to update your name, email, phone number, and delivery address.",
    category: "Account & Profile"
  },
  {
    id: "5",
    question: "How do I add items to favorites?",
    answer: "Tap the heart icon on any restaurant card or item to add it to your favorites. You can view all favorites in the Profile tab.",
    category: "App Features"
  },
  {
    id: "6",
    question: "What if I have a complaint about my order?",
    answer: "Contact our customer support through the Help Center or call our support number. We'll investigate and resolve any issues with your order.",
    category: "Orders & Delivery"
  }
];

export default function HelpCenterScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@discountmithra.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderCategoryCard = ({ item }: { item: HelpCategory }) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.9}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  const renderFAQItem = ({ item }: { item: FAQItem }) => (
    <TouchableOpacity 
      style={styles.faqItem} 
      onPress={() => toggleFAQ(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons 
          name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
      </View>
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
      {/* Sticky Header */}
      <View>
        <LinearGradient colors={["#f8fafc", "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help Center</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search help topics..."
            placeholderTextColor="#6b7280"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Help Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Help</Text>
        <View style={styles.categoriesContainer}>
          {helpCategories.map((category) => (
            <View key={category.id}>
              {renderCategoryCard({ item: category })}
            </View>
          ))}
        </View>
      </View>

      {/* Contact Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactCard} onPress={handleCallSupport}>
            <View style={[styles.contactIcon, { backgroundColor: "#10b981" + '20' }]}>
              <Ionicons name="call" size={24} color="#10b981" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>+91 8247556470 </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleContactSupport}>
            <View style={[styles.contactIcon, { backgroundColor: "#3b82f6" + '20' }]}>
              <Ionicons name="mail" size={24} color="#3b82f6" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Us</Text>
              <Text style={styles.contactSubtitle}>admin@discountmithra.com </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
          {searchQuery && ` (${filteredFAQs.length} results)`}
        </Text>
        <View style={styles.faqContainer}>
          {filteredFAQs.map((item) => (
            <View key={item.id}>
              {renderFAQItem({ item })}
            </View>
          ))}
        </View>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  contactContainer: {
    paddingHorizontal: 20,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  faqContainer: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});
