import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { Keyboard } from "react-native";

export default function HomeLayout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 40,
          paddingBottom: 8,
          marginTop: 20,
          display: isKeyboardVisible ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color}></Ionicons>
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bookmark" size={size} color={color}></Ionicons>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons
              name="add-circle"
              size={size}
              color={COLORS.primary}
            ></Ionicons>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications" size={size} color={color}></Ionicons>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle" size={size} color={color}></Ionicons>
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
