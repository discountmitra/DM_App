import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../theme';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
            <Text style={styles.title}>DiscountMithra Mobile App Privacy Policy</Text>
            <Text style={styles.effectiveDate}>Effective Date: 28-10-2025</Text>
            
            <Text style={styles.introText}>
              This Privacy Policy ("Policy") applies to the DiscountMithra mobile application ("Service" or "App") and is owned and operated by DiscountMithra (the "Company," "we," "us," or "our"). This Policy describes how we collect, use, process, and protect your personal information.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.sectionText}>
                We collect the following types of information to provide and improve our services:
              </Text>
              
              <Text style={styles.subsectionTitle}>A. Personally Identifiable Information (PII):</Text>
              <Text style={styles.bulletPoint}>• User Name</Text>
              <Text style={styles.bulletPoint}>• Mobile Number (Required for login and communication)</Text>
              <Text style={styles.bulletPoint}>• Email Address</Text>
              <Text style={styles.bulletPoint}>• Residential Address (Collected only as required for specific local vendor service delivery)</Text>
              
              <Text style={styles.subsectionTitle}>B. Payment Information:</Text>
              <Text style={styles.bulletPoint}>• Via PhonePe Gateway: We do not store your full financial details (e.g., card numbers, UPI PINs). All payments are processed securely by third-party payment gateways (like PhonePe). We only record the transaction status (success/failure) and a Transaction ID.</Text>
              <Text style={styles.bulletPoint}>• Cash Option: For payments made via Cash (for subscriptions or service charges), we only record the transaction log for accounting purposes.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.sectionText}>
                We use the collected information for the following primary purposes:
              </Text>
              <Text style={styles.bulletPoint}>• Service Delivery: To provide discounted services (negotiated with vendors) and process your transactions, including managing both paid subscriptions and free user service requests.</Text>
              <Text style={styles.bulletPoint}>• Offer Communication: To send you notifications about new offers, discounts, and vendor promotions via your mobile number and email address.</Text>
              <Text style={styles.bulletPoint}>• App Improvement: To analyze usage data and performance metrics to develop new features and enhance user experience.</Text>
              <Text style={styles.bulletPoint}>• Customer Support: To respond to your queries and resolve subscription or service-related issues.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Sharing of Your Information</Text>
              <Text style={styles.sectionText}>
                We share your information only when necessary to provide the service or under legal obligation:
              </Text>
              <Text style={styles.bulletPoint}>• With Vendors: When you wish to avail a service or discount, we share your PII (such as User Name and Mobile Number) with the relevant vendor to enable you to claim the in-person discount or service.</Text>
              <Text style={styles.bulletPoint}>• With Third-Party Services: We use third-party services like PhonePe (for payment processing) and analytics providers (for App analysis).</Text>
              <Text style={styles.bulletPoint}>• Legal Compliance: We may disclose your information if required by law or to respond to valid governmental requests.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Your Choices</Text>
              <Text style={styles.bulletPoint}>• You may opt-out of receiving promotional and offer notifications by contacting us.</Text>
              <Text style={styles.bulletPoint}>• Upon request, we will take reasonable steps to delete your account data, excluding any information required to be retained for legal obligations.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Contact Us</Text>
              <Text style={styles.sectionText}>
                If you have any questions or concerns regarding this Privacy Policy, please contact us:
              </Text>
              <Text style={styles.contactInfo}>Company Name: DiscountMithra</Text>
              <Text style={styles.contactInfo}>Email: admin@discountmithra.com</Text>
              <Text style={styles.contactInfo}>Mobile: 7799663223</Text>
              <Text style={styles.contactInfo}>Address: ShanthiNagar, Sircilla, 505301</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  effectiveDate: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  introText: {
    fontSize: 16,
    color: Colors.primary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.primary,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bulletPoint: {
    fontSize: 15,
    color: Colors.primary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  contactInfo: {
    fontSize: 15,
    color: Colors.primary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
});
