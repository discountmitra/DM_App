import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVip } from '../../contexts/VipContext';
import VipPricing from './VipPricing';

interface VipServiceCardProps {
  title: string;
  description: string;
  basePrice: number;
  vipDiscount?: number;
  icon?: string;
  image?: any;
  onPress?: () => void;
  onRequestPress?: () => void;
}

export default function VipServiceCard({
  title,
  description,
  basePrice,
  vipDiscount = 0.5,
  icon,
  image,
  onPress,
  onRequestPress
}: VipServiceCardProps) {
  const { userMode } = useVip();

  return (
    <TouchableOpacity 
      style={[styles.container, userMode === 'vip' && styles.vipContainer]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {userMode === 'vip' && (
        <View style={styles.vipBadge}>
          <Ionicons name="star" size={12} color="#f59e0b" />
          <Text style={styles.vipBadgeText}>VIP</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {icon && <Ionicons name={icon as any} size={24} color="#f59e0b" />}
            {image && <Image source={image} style={styles.serviceImage} />}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        <VipPricing
          basePrice={basePrice}
          vipDiscount={vipDiscount}
          onRequestPress={onRequestPress}
          serviceName="service"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  vipContainer: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  vipBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  vipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
