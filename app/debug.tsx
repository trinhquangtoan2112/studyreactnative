/* eslint-disable react/react-in-jsx-scope */
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function DebugClerk() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    console.log("🔄 Clerk Loaded:", isLoaded);
    console.log("✅ User ID:", userId);
    console.log("🔑 Signed In:", isSignedIn);
  }, [isLoaded, isSignedIn, userId]);

  return (
    <View>
      <Text>isLoaded: {isLoaded ? "✅" : "⏳"}</Text>
      <Text>isSignedIn: {isSignedIn ? "✅" : "⏳"}</Text>
      <Text>User ID: {userId || "❌ Chưa đăng nhập"}</Text>
    </View>
  );
}
