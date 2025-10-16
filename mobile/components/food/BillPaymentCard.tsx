import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BillPaymentCardProps {
  billAmount: string;
  onBillAmountChange: (amount: string) => void;
  onPayBill: () => void;
  discountPercentage: number;
  finalAmount: number;
}

export default function BillPaymentCard({ 
  billAmount, 
  onBillAmountChange, 
  onPayBill, 
  discountPercentage, 
  finalAmount 
}: BillPaymentCardProps) {
  const discountAmount = billAmount ? (parseFloat(billAmount) * discountPercentage) / 100 : 0;

  return (
    <View style={styles.payBillCard}>
      <View style={styles.payBillHeader}>
        <View style={styles.payBillTitleRow}>
          <Ionicons name="receipt" size={20} color="#7c3aed" />
          <Text style={styles.payBillTitle}>Pay your bill</Text>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>Save {discountPercentage}%</Text>
        </View>
      </View>
      
      <View style={styles.billInputRow}>
        <TextInput
          style={styles.billInput}
          placeholder="Type bill amount"
          placeholderTextColor="#9ca3af"
          value={billAmount}
          onChangeText={onBillAmountChange}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.payButton} onPress={onPayBill}>
          <Text style={styles.payButtonText}>Pay Bill</Text>
        </TouchableOpacity>
      </View>
      
      {billAmount && parseFloat(billAmount) > 0 && (
        <View style={styles.billSummary}>
          <Text style={styles.billSummaryText}>
            Bill Amount: ₹{billAmount}
          </Text>
          <Text style={styles.billSummaryText}>
            Discount ({discountPercentage}%): -₹{discountAmount.toFixed(2)}
          </Text>
          <Text style={styles.finalAmountText}>
            Final Amount: ₹{finalAmount.toFixed(2)}
          </Text>
        </View>
      )}
      
      <Text style={styles.extraOfferText}>
        Extra 60% off up to ₹120 for you!! Use GRABON
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  payBillCard: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 12,
  },
  payBillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  payBillTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  payBillTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c3aed",
  },
  billInputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  billInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#111827",
  },
  payButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c3aed",
  },
  billSummary: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  billSummaryText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  finalAmountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  extraOfferText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
});


