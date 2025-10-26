import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '../theme';

export default function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
            <Text style={styles.title}>DiscountMithra Mobile App Terms & Conditions</Text>
            <Text style={styles.effectiveDate}>Effective Date: 28-10-2025</Text>
            
            <Text style={styles.introText}>
              By downloading, installing, or using the DiscountMithra mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms").
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. User Types & Subscription</Text>
              
              <Text style={styles.subsectionTitle}>Subscribed Users (Paid Subscribers):</Text>
              <Text style={styles.bulletPoint}>• Plans: 1 Month: ₹200, 6 Months: ₹699, 1 Year: ₹999.</Text>
              <Text style={styles.bulletPoint}>• Paid subscribers gain access to higher discount rates and our Guaranteed Savings benefits.</Text>
              
              <Text style={styles.subsectionTitle}>Free Users:</Text>
              <Text style={styles.bulletPoint}>• The App is also accessible to Free Users.</Text>
              <Text style={styles.bulletPoint}>• Free users may have access to lower discount rates compared to paid subscribers.</Text>
              
              <Text style={styles.importantText}>
                Non-Refundable: All subscription purchases are NON-REFUNDABLE. No refunds will be provided, regardless of usage.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Discount Guarantee & Service Charges</Text>
              <Text style={styles.bulletPoint}>• Discount Guarantee: Our services aim to deliver significant Money Savings or Time Savings.</Text>
              <Text style={styles.bulletPoint}>• Free User Service Charges: Certain specialized service requests by Free Users will incur a nominal service charge (e.g., ₹9 for event bookings, up to ₹100 for healthcare-related services). These charges will be clearly communicated at the point of service booking.</Text>
              <Text style={styles.bulletPoint}>• Discount Usage: Users are free to avail of discounts any number of times during their valid usage period.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Vendor Transactions and Liability Disclaimer</Text>
              <Text style={styles.bulletPoint}>• Limited Role: DiscountMithra's role is strictly limited to facilitating the discount.</Text>
              <Text style={styles.bulletPoint}>• Service Quality: DiscountMithra is NOT responsible for the quality, reliability, or suitability of the services or products provided by the vendors.</Text>
              <Text style={styles.bulletPoint}>• Disputes: Any disputes between the User and the Vendor concerning service quality are solely between the User and the respective Vendor. DiscountMithra will not mediate or be held liable.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Intellectual Property Rights (IP)</Text>
              <Text style={styles.bulletPoint}>• Ownership: All content, designs, logos, graphics, icons, images, text, and software code within the DiscountMithra mobile application are the exclusive property of DiscountMithra.</Text>
              <Text style={styles.bulletPoint}>• Prohibition on Copying: The unauthorized copying, reproduction, modification, publishing, downloading, or distribution of any part of the App, including but not limited to in-app images, icons, or visual design elements, is strictly prohibited without our prior written consent.</Text>
              <Text style={styles.bulletPoint}>• Legal Action: We reserve the right to initiate immediate legal proceedings against any individual or entity found to be in violation of these IP rights under the applicable Indian Intellectual Property Laws.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. User Conduct</Text>
              <Text style={styles.bulletPoint}>• You agree to use the App lawfully and in compliance with these Terms.</Text>
              <Text style={styles.bulletPoint}>• Any misuse of the App, attempts to gain unauthorized access, or disruption of the App's operations is prohibited.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
              <Text style={styles.bulletPoint}>• We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on our designated online platform.</Text>
              <Text style={styles.bulletPoint}>• Your continued use of the App after the effective date of the revised Terms constitutes your acceptance of the changes.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Contact Us</Text>
              <Text style={styles.sectionText}>
                If you have any questions regarding these Terms & Conditions, please contact us:
              </Text>
              <Text style={styles.contactInfo}>Company Name: DiscountMithra</Text>
              <Text style={styles.contactInfo}>Email: admin@discountmithra.com</Text>
              <Text style={styles.contactInfo}>Mobile: 7799663223</Text>
              <Text style={styles.contactInfo}>Address: Shanthinagar, Sircilla, 505301</Text>
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
  importantText: {
    fontSize: 15,
    color: '#dc2626',
    lineHeight: 22,
    marginTop: Spacing.sm,
    fontWeight: '600',
    backgroundColor: '#fef2f2',
    padding: Spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  contactInfo: {
    fontSize: 15,
    color: Colors.primary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
});
