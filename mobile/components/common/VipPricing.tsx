import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVip } from '../../contexts/VipContext';
import { getVipPrice } from '../../contexts/VipContext';

interface VipPricingProps {
  basePrice: number;
  vipDiscount?: number;
  onRequestPress?: () => void;
  serviceName?: string;
  showRequestButton?: boolean;
}

export default function VipPricing({ 
  basePrice, 
  vipDiscount = 0.5, 
  onRequestPress,
  serviceName = "service",
  showRequestButton = true 
}: VipPricingProps) {
  const { userMode, isVip } = useVip();
  const pricing = getVipPrice(basePrice, isVip, vipDiscount);

  const handleRequestPress = () => {
    if (onRequestPress) {
      onRequestPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pricingContainer}>
        {userMode === 'normal' ? (
          <View style={styles.normalPricing}>
            <View style={styles.priceRow}>
              <Text style={styles.normalPrice}>₹{pricing.normal}</Text>
              <View style={styles.vipPriceLocked}>
                <Ionicons name="lock-closed" size={12} color="#9ca3af" />
                <Text style={styles.vipPriceText}>VIP: ₹{pricing.vip}</Text>
                <Text style={styles.savingsText}>Save ₹{pricing.savings}</Text>
              </View>
            </View>
            <Text style={styles.priceLabel}>per {serviceName}</Text>
          </View>
        ) : (
          <View style={styles.vipPricing}>
            <View style={styles.vipPriceActive}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.vipPriceActiveText}>₹{pricing.vip}</Text>
              <Text style={styles.originalPrice}>₹{pricing.normal}</Text>
            </View>
            <Text style={styles.priceLabel}>per {serviceName}</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>Save ₹{pricing.savings}</Text>
            </View>
          </View>
        )}
      </View>

      {showRequestButton && (
        <TouchableOpacity 
          style={[
            styles.requestButton,
            userMode === 'vip' && styles.vipRequestButton
          ]} 
          onPress={handleRequestPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={userMode === 'vip' ? 'flash' : 'arrow-forward'} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.requestButtonText}>
            {userMode === 'vip' ? 'Request Now (Free)' : `Request Now (₹${pricing.normal})`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pricingContainer: {
    marginBottom: 12,
  },
  normalPricing: {
    // Normal user pricing layout
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  normalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  vipPriceLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  vipPriceText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
  },
  vipPricing: {
    alignItems: 'flex-start',
  },
  vipPriceActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  vipPriceActiveText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f59e0b',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  savingsBadgeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  vipRequestButton: {
    backgroundColor: '#f59e0b',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
