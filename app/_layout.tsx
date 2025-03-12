/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView, StatusBar } from "react-native";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/provider/ClerkAndConvexProvider";
import { ConvexReactClient } from "convex/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require("@/assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) await SplashScreen.hideAsync();
  }, [loaded]);
  return (
    <ClerkAndConvexProvider>
      <StatusBar
        backgroundColor={"#000"}
        barStyle={"light-content"}
      ></StatusBar>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#000" }}
          onLayout={onLayoutRootView}
        >
          {/* <StatusBar style="auto" /> */}
          <InitialLayout></InitialLayout>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
