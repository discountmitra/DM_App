import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVip } from '../../contexts/VipContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface UserModeToggleProps {
  onModeChange?: (mode: 'normal' | 'vip') => void;
}

export default function UserModeToggle({ onModeChange }: UserModeToggleProps) {
  const { userMode, isVip, toggleMode } = useVip();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [slideAnim] = useState(new Animated.Value(isVip ? 1 : 0));
  const [popupAnim] = useState(new Animated.Value(0));
  const [successAnim] = useState(new Animated.Value(0));

  // Show success popup when user becomes VIP
  useEffect(() => {
    if (isVip && !showUpgradePopup) {
      setShowSuccessPopup(true);
      Animated.spring(successAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isVip]);

  const handleModePress = (mode: 'normal' | 'vip') => {
    if (mode === 'vip' && !isVip) {
      // Show upgrade popup for non-VIP users with animation
      setShowUpgradePopup(true);
      Animated.spring(popupAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      return;
    }
    
    if (mode !== userMode) {
      toggleMode();
      onModeChange?.(mode);
    }
  };

  const handleUpgrade = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowUpgradePopup(false);
      router.push('/vip-subscription');
    });
  };

  const handleClosePopup = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowUpgradePopup(false);
    });
  };

  const handleCloseSuccessPopup = () => {
    Animated.timing(successAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessPopup(false);
    });
  };

  // Animate slide indicator with Zepto-like smooth transition
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: userMode === 'vip' ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [userMode, slideAnim]);

  const slideTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 48) / 2 - 6], // Half width minus padding and margins
  });

  const slideBackgroundColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b82f6', '#d97706'], // Blue for Normal, Dark golden for VIP
  });

  const normalTextColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#64748b'], // White when active (blue bg), gray when inactive
  });

  const vipTextColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#64748b', '#ffffff'], // Gray when inactive, white when active (golden bg)
  });

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={styles.toggleContainer}>
          <Animated.View 
            style={[
              styles.slideIndicator,
              { 
                transform: [{ translateX: slideTranslateX }],
                backgroundColor: slideBackgroundColor,
              }
            ]} 
          />
          
          <TouchableOpacity
            style={[styles.toggleButton, userMode === 'normal' && styles.activeToggle]}
            onPress={() => handleModePress('normal')}
            activeOpacity={0.8}
          >
            <Animated.Text style={[styles.toggleText, { color: normalTextColor }]}>
              Normal
            </Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton, 
              userMode === 'vip' && styles.activeToggle,
              !isVip && styles.lockedToggle
            ]}
            onPress={() => handleModePress('vip')}
            activeOpacity={0.8}
          >
            {userMode === 'vip' && isVip ? (
              <View style={styles.vipContent}>
                <Ionicons name="star" size={14} color="#fff" />
                <Animated.Text style={[styles.toggleText, { color: vipTextColor }]}>VIP</Animated.Text>
              </View>
            ) : (
              <View style={styles.vipContent}>
                {!isVip && <Ionicons name="lock-closed" size={14} color="#9ca3af" />}
                <Animated.Text style={[styles.toggleText, { color: vipTextColor }]}>VIP</Animated.Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Location Row removed as requested */}
      </View>

      {/* Upgrade Confirmation Popup */}
      <Modal
        visible={showUpgradePopup}
        transparent={true}
        animationType="none"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.popupOverlay}>
          <TouchableWithoutFeedback onPress={handleClosePopup}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  {
                    scale: popupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
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
              <Ionicons name="star" size={32} color="#f59e0b" />
              <Text style={styles.popupTitle}>Unlock VIP Benefits</Text>
              <Text style={styles.popupSubtitle}>
                Get unlimited requests, 2X discounts, and exclusive offers
              </Text>
            </View>

            <View style={styles.popupBenefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Unlimited requests (vs ₹9 per request)</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>2X discounts on all services</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Priority customer support</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Save up to ₹9,999+ every year</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Save time and money on every request</Text>
              </View>
            </View>

            <View style={styles.popupButtons}>
              <TouchableOpacity 
                style={styles.upgradeButton} 
                onPress={handleUpgrade}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.upgradeGradient}
                >
                  <Ionicons name="star" size={18} color="#fff" />
                  <Text style={styles.upgradeText}>Subscribe to VIP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Success Popup for VIP Users */}
      <Modal
        visible={showSuccessPopup}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseSuccessPopup}
      >
        <View style={styles.popupOverlay}>
          <TouchableWithoutFeedback onPress={handleCloseSuccessPopup}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: successAnim,
              },
            ]}
          >
            <View style={styles.popupHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseSuccessPopup}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.popupTitle}>Welcome to VIP!</Text>
              <Text style={styles.popupSubtitle}>
                Your subscription is now active. Enjoy all the premium benefits!
              </Text>
            </View>

            <View style={styles.benefitsList}>
              <Text style={styles.benefitsTitle}>You now have access to:</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitItemText}>Unlimited free service requests</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitItemText}>Priority customer support</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.benefitItemText}>Exclusive deals and offers</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleCloseSuccessPopup}
            >
              <Text style={styles.successButtonText}>Start Using VIP</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 3,
    position: 'relative',
    marginHorizontal: 4,
    // marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  slideIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: '50%',
    bottom: 3,
    borderRadius: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    zIndex: 1,
  },
  activeToggle: {
    // Active state handled by slide indicator
  },
  lockedToggle: {
    opacity: 0.6,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  vipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationGradient: {},
  benefitsList: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitItemText: {
    fontSize: 13,
    color: '#374151',
  },
  successButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  popupBenefits: {
    marginBottom: 20,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  popupButtons: {
    gap: 12,
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
    fontWeight: '700',
  },
});
