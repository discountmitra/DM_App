import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontSizes, FontWeights } from "../../theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  billAmount: string;
  onChangeAmount: (text: string) => void;
  discountPercentage: number;
  vipDiscountPercentage?: number;
  isVip?: boolean;
  onPressPay: () => void;
  onVipUpgrade?: () => void;
};

export default function PayBillCard({ billAmount, onChangeAmount, discountPercentage, vipDiscountPercentage, isVip, onPressPay, onVipUpgrade }: Props) {
  const amount = parseFloat(billAmount) || 0;
  const discount = (amount * discountPercentage) / 100;
  const finalAmount = Math.max(0, amount - discount);
  
  // Calculate VIP discount for display
  const vipDiscount = vipDiscountPercentage ? (amount * vipDiscountPercentage) / 100 : 0;
  const vipFinalAmount = vipDiscountPercentage ? Math.max(0, amount - vipDiscount) : 0;
  

  return (
    <View style={styles.payBillCard}>
      <View style={styles.payBillHeader}>
        <View style={styles.payBillTitleRow}>
          <View style={styles.payBillIconContainer}>
            <Ionicons name="receipt" size={24} color="#fff" />
          </View>
          <View style={styles.payBillTitleContainer}>
            <Text style={styles.payBillTitle}>Pay your bill</Text>
            <Text style={styles.payBillSubtitle}>
              Get instant {isVip ? `${discountPercentage}% VIP discount` : `${discountPercentage}% discount`} at billing counter
            </Text>
          </View>
        </View>
        <View style={styles.discountBadge}>
          <Ionicons name={isVip ? "star" : "flash"} size={12} color="#7c3aed" />
          <Text style={styles.discountBadgeText}>
            {isVip ? `VIP ${discountPercentage}%` : `Save ${discountPercentage}%`}
          </Text>
        </View>
      </View>

      <View style={styles.billInputSection}>
        <Text style={styles.billInputLabel}>Enter your bill amount</Text>
        <View style={styles.billInputRow}>
          <View style={styles.currencySymbol}><Text style={styles.currencyText}>₹</Text></View>
          <TextInput
            style={styles.billInput}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={billAmount}
            onChangeText={onChangeAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.payButton} onPress={onPressPay}>
            <Ionicons name="arrow-forward" size={16} color="#7c3aed" />
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {amount > 0 && (
        <View style={styles.billSummary}>
          <View style={styles.billSummaryHeader}>
            <Text style={styles.billSummaryTitle}>Bill Breakdown</Text>
            <Ionicons name="calculator" size={16} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={styles.billSummaryContent}>
            <View style={styles.billSummaryRow}><Text style={styles.billSummaryLabel}>Bill Amount</Text><Text style={styles.billSummaryValue}>₹{amount.toFixed(2)}</Text></View>
            <View style={styles.billSummaryRow}>
              <Text style={styles.billSummaryLabel}>
                {isVip ? `VIP Discount (${discountPercentage}%)` : `Discount (${discountPercentage}%)`}
              </Text>
              <Text style={[styles.billSummaryDiscount, isVip && styles.vipDiscountAmount]}>
                -₹{discount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.billSummaryDivider} />
            <View style={styles.billSummaryRow}><Text style={styles.finalAmountLabel}>You Pay</Text><Text style={styles.finalAmountValue}>₹{finalAmount.toFixed(2)}</Text></View>
            
            {/* VIP Discount Preview for Normal Users - Show inside bill summary */}
            {!isVip && vipDiscountPercentage && amount > 0 && (
              <TouchableOpacity 
                style={styles.vipDiscountPreview}
                onPress={onVipUpgrade}
                activeOpacity={0.8}
              >
                <View style={styles.vipDiscountContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vipDiscountText}>
                      Pay only <Text style={styles.vipAmountHighlight}>₹{vipFinalAmount.toFixed(2)}</Text> with VIP
                    </Text>
                    <Text style={styles.vipDiscountSubtext}>
                      Save additional ₹{(discount - vipDiscount).toFixed(2)} more!
                    </Text>
                  </View>
                  <View style={styles.vipBadge}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.vipBadgeText}>VIP</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  payBillCard: {
    backgroundColor: "#1f2937",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1f2937",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  payBillHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  payBillTitleRow: { flexDirection: "row", alignItems: "flex-start", flex: 1 },
  payBillIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  payBillTitleContainer: { flex: 1 },
  payBillTitle: { fontSize: FontSizes.title, color: "#fff", marginBottom: 4, fontFamily: FontWeights.bold },
  payBillSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 18 },
  discountBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 6, paddingVertical: 8, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,width: 80 },
  discountBadgeText: { fontSize: 12, color: "#7c3aed", marginLeft: 4, fontFamily: FontWeights.semibold },
  billInputSection: { marginBottom: 20 },
  billInputLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 12, fontFamily: FontWeights.medium },
  billInputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  currencySymbol: { marginRight: 8 },
  currencyText: { fontSize: 18, color: "#fff", fontFamily: FontWeights.bold },
  billInput: { flex: 1, paddingVertical: 16, fontSize: 18, color: "#fff", fontFamily: FontWeights.semibold },
  payButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 22, paddingVertical: 14, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  payButtonText: { fontSize: 15, color: "#7c3aed", marginLeft: 4, fontFamily: FontWeights.bold },
  billSummary: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  billSummaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  billSummaryTitle: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontFamily: FontWeights.semibold },
  billSummaryContent: { padding: 20 },
  billSummaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  billSummaryLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: FontWeights.medium },
  billSummaryValue: { fontSize: 14, color: "#fff", fontFamily: FontWeights.semibold },
  billSummaryDiscount: { fontSize: 14, color: "#10b981", fontFamily: FontWeights.semibold },
  vipDiscountAmount: { color: "#fbbf24", fontFamily: FontWeights.bold },
  billSummaryDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 12 },
  finalAmountLabel: { fontSize: 16, color: "#fff", fontFamily: FontWeights.bold },
  finalAmountValue: { fontSize: 20, color: "#fff", fontFamily: FontWeights.bold },
  
  // VIP Discount Preview Styles
  vipDiscountPreview: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "solid",
  },
  vipDiscountContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vipDiscountText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontFamily: FontWeights.medium,
    marginBottom: 2,
  },
  vipAmountHighlight: {
    fontSize: 14,
    color: "#fbbf24",
    fontFamily: FontWeights.bold,
  },
  vipDiscountSubtext: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontFamily: FontWeights.regular,
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251,191,36,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vipBadgeText: {
    fontSize: 10,
    color: "#fbbf24",
    fontFamily: FontWeights.semibold,
    marginLeft: 4,
  },
});


