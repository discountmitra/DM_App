import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVip } from '../../contexts/VipContext';

export default function VipStatusToggle() {
  const { isVip, userMode, toggleVipStatus } = useVip();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIP Status (Demo)</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, isVip && styles.vipBadge]}>
          <Ionicons 
            name={isVip ? "star" : "person"} 
            size={16} 
            color={isVip ? "#f59e0b" : "#6b7280"} 
          />
          <Text style={[styles.statusText, isVip && styles.vipText]}>
            {isVip ? "VIP Member" : "Normal User"}
          </Text>
        </View>
        <Text style={styles.modeText}>Current Mode: {userMode.toUpperCase()}</Text>
      </View>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleVipStatus}>
        <Text style={styles.toggleText}>
          {isVip ? "Simulate Normal User" : "Simulate VIP User"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  vipBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  vipText: {
    color: '#f59e0b',
  },
  modeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  toggleButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
