import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (text: string) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, "");
    
    if (cleanedText.length > 10) {
      setPhoneError("Phone number cannot exceed 10 digits");
      return;
    } else {
      setPhoneError("");
    }
    
    setPhoneNumber(cleanedText);
  };

  const handleDone = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (emailError || phoneError) {
      Alert.alert("Error", "Please fix the validation errors");
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    // Complete profile and navigate to main app
    const fullName = `${firstName} ${lastName}`.trim();
    completeProfile(fullName);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Please enter your personal details to complete your profile
        </Text>

        {/* Name Fields */}
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.nameField}>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <TextInput
            style={[styles.input, styles.fullWidthInput]}
            placeholder="E-mail"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Phone Number Field */}
        <View style={styles.fieldContainer}>
          <TextInput
            style={[styles.input, styles.fullWidthInput]}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          We may send promotions related to our services - you can unsubscribe anytime in Communication preferences under your Profile.
        </Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  instructionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  nameField: {
    flex: 1,
    marginHorizontal: 4,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.primary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  fullWidthInput: {
    width: "100%",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
  doneButton: {
    backgroundColor: "#F3F4F6",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});
