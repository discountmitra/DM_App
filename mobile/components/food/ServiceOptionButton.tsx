import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ServiceOptionButtonProps {
  title: string;
  subtitle: string;
  isActive: boolean;
  onPress: () => void;
}

export default function ServiceOptionButton({ title, subtitle, isActive, onPress }: ServiceOptionButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.serviceOption, isActive && styles.serviceOptionActive]}
      onPress={onPress}
    >
      <Text style={[styles.serviceOptionText, isActive && styles.serviceOptionTextActive]}>
        {title}
      </Text>
      <Text style={[styles.serviceOptionSubtext, isActive && styles.serviceOptionSubtextActive]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  serviceOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  serviceOptionActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  serviceOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6b7280",
    textAlign: "center",
  },
  serviceOptionTextActive: {
    color: "#fff",
  },
  serviceOptionSubtext: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 2,
  },
  serviceOptionSubtextActive: {
    color: "#fff",
  },
});


