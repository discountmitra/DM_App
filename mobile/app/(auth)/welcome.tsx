import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
// Logo now fetched from backend API

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const { authState } = useAuth();

  // Background section reveal animations
  const bg1Progress = useRef(new Animated.Value(0)).current;
  const bg2Progress = useRef(new Animated.Value(0)).current;
  const bg3Progress = useRef(new Animated.Value(0)).current;

  // Logo/brand animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Text sequences
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateX = useRef(new Animated.Value(-30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const taglineScale = useRef(new Animated.Value(0.9)).current;
  // Removed bottom welcome text

  // Subtle pulsing border overlay
  const borderPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations immediately when screen loads
    Animated.stagger(200, [
      Animated.timing(bg1Progress, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(bg2Progress, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(bg3Progress, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 1100, delay: 400, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, delay: 400, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(brandTranslateX, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(taglineTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.spring(taglineScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(borderPulse, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.timing(borderPulse, { toValue: 0, duration: 1600, useNativeDriver: false }),
      ])
    ).start();

    // Navigate after ~6s based on auth state (wait for loading to complete)
    const timer = setTimeout(() => {
      if (!authState.isLoading) {
        if (authState.isAuthenticated) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [authState.isAuthenticated, authState.isLoading]);

  // no logo rotation

  // Background transforms based on progress values
  const bg1Transform = {
    transform: [
      { translateX: bg1Progress.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] }) },
      { rotate: "-8deg" },
    ],
    opacity: bg1Progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  } as const;

  const bg2Transform = {
    transform: [
      { translateY: bg2Progress.interpolate({ inputRange: [0, 1], outputRange: [-height, 0] }) },
      { rotate: "10deg" },
    ],
    opacity: bg2Progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  } as const;

  const bg3Transform = {
    transform: [
      { translateX: bg3Progress.interpolate({ inputRange: [0, 1], outputRange: [width, 0] }) },
      { rotate: "-15deg" },
    ],
    opacity: bg3Progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  } as const;

  // Border pulse style
  const borderStyle = {
    borderWidth: borderPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }),
    borderColor: "rgba(255,255,255,0.6)",
  } as const;

  return (
    <View style={styles.container}>
      {/* Animated background sections */}
      <Animated.View style={[styles.sectionBase, styles.sectionYellow, bg1Transform]} />
      <Animated.View style={[styles.sectionBase, styles.sectionBlue, bg2Transform]} />
      <Animated.View style={[styles.sectionBase, styles.sectionGreen, bg3Transform]} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: "https://rwrwadrkgnbiekvlrpza.supabase.co/storage/v1/object/public/dm-images/assets/logo.png" }}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.Text
            style={[
              styles.brandName,
              {
                opacity: brandOpacity,
                transform: [{ translateX: brandTranslateX }],
              },
            ]}
          >
            discountmithrA
          </Animated.Text>

          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineOpacity,
                transform: [
                  { translateY: taglineTranslateY },
                  { scale: taglineScale },
                ],
              },
            ]}
          >
            We bargain, U save
          </Animated.Text>
        </View>
        {/* Bottom welcome removed */}
      </View>

      {/* Pulsing border effect */}
      <Animated.View pointerEvents="none" style={[styles.borderOverlay, borderStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  // Background sections (rotated, full-bleed)
  sectionBase: {
    position: "absolute",
    top: -height * 0.2,
    left: -width * 0.2,
    width: width * 1.4,
    height: height * 1.4,
    opacity: 0,
  },
  sectionYellow: { backgroundColor: "#FFD300" },
  sectionBlue: { backgroundColor: "#0096E6" },
  sectionGreen: { backgroundColor: "#00C851" },

  logoContainer: {
    marginTop: height * 0.18,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    width: 160,
    height: 160,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // removed bottom area styles
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
});
