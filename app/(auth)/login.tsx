/* eslint-disable react/no-unescaped-entities */
import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { styles } from "@/utils/auth.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(home)");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary}></Ionicons>
        </View>
        <Text style={styles.appName}>Spot light</Text>
        <Text style={styles.tagLine}>Don't miss anything</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/Auth-bg2.png")}
          style={styles.illustration}
          resizeMode="cover"
        ></Image>
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.9}
          onPress={handleGoogleSignIn}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons
              name="logo-google"
              size={20}
              color={COLORS.surface}
            ></Ionicons>
          </View>
          <Text style={styles.googleButtonText}>Continue with Googles</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
