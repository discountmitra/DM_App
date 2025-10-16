import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontWeights } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useVip } from '../../contexts/VipContext';
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceActionButtonProps {
  onPress: () => void;
  serviceName: string;
  basePrice?: number;
  vipDiscount?: number;
  buttonText?: string;
  style?: any;
}

export default function ServiceActionButton({ 
  onPress, 
  serviceName, 
  basePrice = 9, 
  vipDiscount = 1.0, // 100% discount (free) for VIP
  buttonText,
  style 
}: ServiceActionButtonProps) {
  const { userMode, isVip } = useVip();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [popupAnim] = useState(new Animated.Value(0));

  const vipPrice = Math.round(basePrice * (1 - vipDiscount));
  const savings = basePrice - vipPrice;

  const handlePress = () => {
    if (userMode === 'normal') {
      // Show payment popup for normal users
      setShowPaymentPopup(true);
      Animated.spring(popupAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // VIP users can proceed directly
      onPress();
    }
  };

  const handleClosePopup = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPaymentPopup(false);
    });
  };

  const handleContinueWithPayment = () => {
    handleClosePopup();
    onPress();
  };

  const handleUpgradeToVip = () => {
    handleClosePopup();
    // Navigate to VIP subscription
    // router.push('/vip-subscription');
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    
    if (userMode === 'vip') {
      return vipPrice === 0 ? 'Request Now (Free)' : `Request Now (₹${vipPrice})`;
    } else {
      return `Request Now (₹${basePrice})`;
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.button,
          userMode === 'vip' && styles.vipButton,
          style
        ]} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {userMode === 'vip' ? (
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="flash" size={16} color="#fff" />
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </LinearGradient>
        ) : (
          <>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Payment Popup for Normal Users */}
      {showPaymentPopup && (
        <View style={styles.popupOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  {
                    translateY: popupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 0],
                    }),
                  },
                ],
                opacity: popupAnim,
              },
            ]}
          >
            <View style={styles.popupHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClosePopup}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              <Ionicons name="card" size={32} color="#3b82f6" />
              <Text style={styles.popupTitle}>Payment Required</Text>
              <Text style={styles.popupSubtitle}>
                Choose your payment option for {serviceName}
              </Text>
            </View>

            <View style={styles.pricingInfo}>
              <View style={styles.priceRow}>
                <Text style={styles.normalPrice}>₹{basePrice}</Text>
                <View style={styles.vipPriceLocked}>
                  <Ionicons name="lock-closed" size={12} color="#9ca3af" />
                  <Text style={styles.vipPriceText}>VIP: ₹{vipPrice}</Text>
                  <Text style={styles.savingsText}>Save ₹{savings}</Text>
                </View>
              </View>
            </View>

            <View style={styles.popupButtons}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinueWithPayment}
              >
                <Text style={styles.continueText}>Continue with ₹{basePrice}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.upgradeButton} 
                onPress={handleUpgradeToVip}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.upgradeGradient}
                >
                  <Ionicons name="star" size={18} color="#fff" />
                  <Text style={styles.upgradeText}>Take VIP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  vipButton: {
    backgroundColor: 'transparent',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontWeights.semibold,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    zIndex: 1000,
  },
  popupContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  popupHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  popupSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  pricingInfo: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  normalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  vipPriceLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  vipPriceText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  popupButtons: {
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: FontWeights.semibold,
  },
  upgradeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FontWeights.bold,
  },
});
