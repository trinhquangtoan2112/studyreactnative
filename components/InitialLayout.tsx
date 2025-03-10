import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segment = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthPage = segment[0] === "(auth)";
    if (!isSignedIn && !inAuthPage) router.replace("/(auth)/login");
    else if (isSignedIn && inAuthPage) router.replace("/(home)");
  }, [isLoaded, isSignedIn, segment]);

  if (!isLoaded) return null;
  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
