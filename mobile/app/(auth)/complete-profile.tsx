import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, requestOtpForRegistration } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setRegistrationError(""); // Clear registration error when user types
    if (text && !validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (text: string) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, "");
    
    setRegistrationError(""); // Clear registration error when user types
    
    if (cleanedText.length > 10) {
      setPhoneError("Phone number cannot exceed 10 digits");
      return;
    } else {
      setPhoneError("");
    }
    
    setPhoneNumber(cleanedText);
  };

  const handleDone = async () => {
    // Check required fields (firstName, email, phoneNumber are required; lastName is optional)
    if (!firstName.trim() || !email.trim() || !phoneNumber.trim()) {
      setRegistrationError("Please fill in all required fields");
      return;
    }

    if (emailError || phoneError) {
      setRegistrationError("Please fix the validation errors");
      return;
    }

    if (phoneNumber.length !== 10) {
      setRegistrationError("Please enter a valid 10-digit phone number");
      return;
    }

    if (isLoading) return; // Prevent multiple clicks

    setRegistrationError(""); // Clear any previous registration error
    setIsLoading(true);

    try {
      // Join firstName and lastName, but only if lastName exists
      const fullName = lastName.trim() 
        ? `${firstName} ${lastName}`.trim() 
        : firstName.trim();
      
      // First, register the user
      await register(fullName, `+91${phoneNumber}`, email);
      
      // Then request OTP for verification (using registration endpoint)
      await requestOtpForRegistration(`+91${phoneNumber}`);
      
      // Navigate to verify phone screen
      router.push({ pathname: "/verify-phone", params: { phone: `+91${phoneNumber}` } });
    } catch (e: any) {
      // Handle specific error messages from backend
      const errorMessage = e?.message || 'Failed to register';
      
      // Check for specific error messages from backend
      // The backend returns "Email already exists" or "Phone number already exists"
      const lowerErrorMessage = errorMessage.toLowerCase();
      
      if (lowerErrorMessage.includes('email already exists')) {
        setEmailError('This email is already registered');
        setPhoneError(''); // Clear phone error
        setRegistrationError('This email is already registered. Please use a different email address.');
      } else if (lowerErrorMessage.includes('phone number already exists') || lowerErrorMessage.includes('user number already exists')) {
        setPhoneError('This phone number is already registered');
        setEmailError(''); // Clear email error
        setRegistrationError('This phone number is already registered. Please use a different phone number.');
      } else {
        // Generic error
        setPhoneError('');
        setEmailError('');
        setRegistrationError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
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
              placeholder="First name *"
              placeholderTextColor="#111827"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.nameField}>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#111827"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <TextInput
            style={[styles.input, styles.fullWidthInput, emailError ? styles.inputError : null]}
            placeholder="E-mail *"
            placeholderTextColor="#111827"
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
            style={[styles.input, styles.fullWidthInput, phoneError ? styles.inputError : null]}
            placeholder="Phone number *"
            placeholderTextColor="#111827"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

      </View>

      {/* Inline Registration Error (gentle) */}
      {registrationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.registrationErrorText}>{registrationError}</Text>
        </View>
      ) : null}
      {/* Done Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { opacity: isLoading ? 0.5 : 1 }
        ]}
        onPress={handleDone}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.continueButtonText}>Done</Text>
        )}
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
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
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
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  registrationErrorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
