import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { verifyOtp } = useAuth();
  const params = useLocalSearchParams();
  const phone = (Array.isArray(params.phone) ? params.phone[0] : params.phone) as string | undefined;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        verifyTimerRef.current = setTimeout(async () => {
          try {
            if (!phone) throw new Error('Missing phone');
            await verifyOtp(phone, otpString);
          } catch (e) {
            // allow button retry
          } finally {
            setTimeout(() => setIsVerifying(false), 800);
          }
        }, 600);
    }
    return () => {
      if (verifyTimerRef.current) {
        clearTimeout(verifyTimerRef.current);
        verifyTimerRef.current = null;
      }
    };
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    if (isVerifying) return;

    // Normalize to digits only
    const digitsOnly = value.replace(/\D/g, '');

    // If autofill/paste provides multiple digits, distribute across inputs
    if (digitsOnly.length > 1) {
      const spread = digitsOnly.slice(0, 4).split("");
      const next = ["", "", "", ""] as string[];
      for (let i = 0; i < 4; i++) {
        const fromIndex = i - index;
        // place starting at current index
        if (fromIndex >= 0 && fromIndex < spread.length) next[i] = spread[fromIndex];
      }
      // If user tapped first box, simpler: fill from start
      if (index === 0) {
        for (let i = 0; i < spread.length; i++) next[i] = spread[i];
      }
      setOtp(next);
      // Move focus to last filled cell
      const lastIdx = Math.min(spread.length - 1 + (index === 0 ? 0 : index), 3);
      inputRefs.current[lastIdx]?.focus();
      return;
    }

    // Single digit flow
    const newOtp = [...otp];
    newOtp[index] = digitsOnly;
    setOtp(newOtp);
    if (digitsOnly && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length === 4) {
      if (!isVerifying) {
        setIsVerifying(true);
        inputRefs.current[3]?.blur?.();
        Keyboard.dismiss();
        if (verifyTimerRef.current) {
          clearTimeout(verifyTimerRef.current);
        }
        try {
          if (!phone) throw new Error('Missing phone');
          await verifyOtp(phone, otpString);
        } finally {
          setTimeout(() => setIsVerifying(false), 800);
        }
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
          We sent a verification code to {phone || 'your number'}
        </Text>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 240,
    gap: 16,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    backgroundColor: "#fff",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
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

