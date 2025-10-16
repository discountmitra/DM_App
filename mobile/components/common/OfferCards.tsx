import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { serviceOffers, categoryOffers } from '../../constants/offerData';
import { useVip } from '../../contexts/VipContext';
import { router } from 'expo-router';

interface OfferCardsProps {
  normalOffers?: string[];
  vipOffers?: string[];
  category: 'hospital' | 'home-service' | 'event' | 'construction' | 'beauty';
  serviceType?: string;
}

const OfferCards: React.FC<OfferCardsProps> = ({ normalOffers, vipOffers, category, serviceType }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Get offers based on service type or fallback to category
  const getOffers = () => {
    if (normalOffers && vipOffers) {
      return { normal: normalOffers, vip: vipOffers };
    }
    
    if (serviceType && serviceOffers[category] && serviceOffers[category][serviceType]) {
      return serviceOffers[category][serviceType];
    }
    
    return categoryOffers[category] || { normal: [], vip: [] };
  };

  const offers = getOffers();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmerAnim]);

  const getCategoryIcon = (type: 'normal' | 'vip') => {
    switch (category) {
      case 'hospital':
        return type === 'normal' ? 'medical' : 'star';
      case 'home-service':
        return type === 'normal' ? 'home' : 'star';
      case 'event':
        return type === 'normal' ? 'calendar' : 'star';
      case 'construction':
        return type === 'normal' ? 'construct' : 'star';
      case 'beauty':
        return type === 'normal' ? 'flower' : 'star';
      default:
        return type === 'normal' ? 'person' : 'star';
    }
  };

  const getCategoryColors = () => {
    switch (category) {
      case 'hospital':
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
      case 'home-service':
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
      case 'event':
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
      case 'construction':
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
      case 'beauty':
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
      default:
        return {
          normal: ["#dbeafe", "#bfdbfe", "#93c5fd"],
          vip: ["#1a1a1f", "#0f0f14"]
        };
    }
  };

  const getCategoryTextColor = () => {
    switch (category) {
      case 'hospital':
        return '#1e40af';
      case 'home-service':
        return '#1e40af';
      case 'event':
        return '#1e40af';
      case 'construction':
        return '#1e40af';
      case 'beauty':
        return '#1e40af';
      default:
        return '#1e40af';
    }
  };

  const colors = getCategoryColors();
  const textColor = getCategoryTextColor();

  const { isVip } = useVip();

  const handleVipPress = () => {
    if (!isVip) {
      router.push('/vip-subscription');
    }
  };

  return (
    <View style={styles.offersContainer}>
      {/* Normal User Section */}
      <LinearGradient 
        colors={colors.normal} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.offerCard}
      >
        <View style={styles.offerCardHeader}>
          <View style={[styles.normalIconContainer, { borderColor: textColor }]}>
            <Ionicons name={getCategoryIcon('normal')} size={24} color={textColor} />
          </View>
          <Text style={[styles.normalCardTitle, { color: textColor }]}>Normal</Text>
          <View style={[styles.normalBadge, { backgroundColor: textColor }]}>
            <Text style={styles.normalBadgeText}>Standard</Text>
          </View>
        </View>
        <View style={styles.offerCardBody}>
          {offers.normal.map((offer, i) => (
            <View key={i} style={styles.offerRow}>
              <View style={[styles.normalBullet, { backgroundColor: textColor }]} />
              <Text style={[styles.normalOfferText, { color: textColor }]}>{offer}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* VIP User Section */}
      <TouchableOpacity activeOpacity={0.85} onPress={handleVipPress} style={{ flex: 1 }}>
        <LinearGradient 
          colors={colors.vip} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.offerCard}
        >
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 400] }) }] }]}
        >
          <LinearGradient colors={["transparent", "rgba(255,215,0,0.35)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
        </Animated.View>
        <View style={styles.offerCardHeader}>
          <View style={styles.vipIconContainer}>
            <Ionicons name={getCategoryIcon('vip')} size={24} color="#fbbf24" />
          </View>
          <Text style={styles.vipCardTitle}>VIP</Text>
          <View style={styles.vipBadge}>
            <Text style={styles.vipBadgeText}>Premium</Text>
          </View>
        </View>
          <View style={styles.offerCardBody}>
          {offers.vip.map((offer, i) => (
            <View key={i} style={styles.offerRow}>
              <View style={styles.vipBullet} />
              <Text style={styles.vipOfferText}>{offer}</Text>
            </View>
          ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  offersContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  offerCard: {
    flex: 1,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  offerCardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  normalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
  },
  vipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(251,191,36,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  normalCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  vipCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },
  normalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  normalBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  vipBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  vipBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: 0.5,
  },
  offerCardBody: {
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  offerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  normalBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 6,
  },
  vipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fbbf24",
    marginRight: 10,
    marginTop: 6,
  },
  normalOfferText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    flex: 1,
  },
  vipOfferText: {
    fontSize: 13,
    color: "#f8fafc",
    lineHeight: 18,
    fontWeight: "500",
    flex: 1,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 180,
    opacity: 0.6,
  },
});

export default OfferCards;
