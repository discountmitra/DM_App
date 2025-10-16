import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-verify when 4 digits are entered
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 4 && !isVerifying) {
      setIsVerifying(true);
      inputRefs.current[3]?.blur?.();
      Keyboard.dismiss();
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
      }
        verifyTimerRef.current = setTimeout(() => {
          // Simulate OTP verification and login
          login("1234567890"); // You can get the actual phone number from route params
          // Don't navigate here - let the auth state change handle navigation
          // Safety: reset verifying after login
          setTimeout(() => setIsVerifying(false), 1200);
        }, 1000);
    }
    return () => {
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
        verifyTimerRef.current = null;
      }
    };
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    // Prevent edits while verifying
    if (isVerifying) return;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 4) {
      if (!isVerifying) {
        setIsVerifying(true);
        inputRefs.current[3]?.blur?.();
        Keyboard.dismiss();
        if (verifyTimerRef.current) {
          clearTimeout(verifyTimerRef.current);
        }
        verifyTimerRef.current = setTimeout(() => {
          // Don't navigate here - let the auth state change handle navigation
          setTimeout(() => setIsVerifying(false), 1200);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify phone number</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          We sent a verification code to +16502137390
        </Text>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        {isVerifying && (
          <View style={styles.verifyingContainer}>
            <ActivityIndicator size="small" color="#10B981" />
            <Text style={styles.verifyingText}>Verifying...</Text>
          </View>
        )}
      </View>

      {/* Verify Button */}
      <TouchableOpacity 
        style={[
          styles.verifyButton, 
          { opacity: otp.join("").length === 4 && !isVerifying ? 1 : 0.5 }
        ]} 
        onPress={handleVerify}
        disabled={otp.join("").length !== 4 || isVerifying}
      >
        {isVerifying ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.verifyButtonText}>Verifying...</Text>
          </View>
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 280,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: Colors.primary,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  verifyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: 8,
  },
  verifyingText: {
    marginLeft: 8,
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#10B981",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
