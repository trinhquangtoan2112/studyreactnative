import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";

export default function NotFoundScreen() {
  const nav = useNavigation();
  useEffect(() => {
    const routeName = nav.getState()?.routes?.at(-1)?.name;
    if (routeName === "(app)/+not-found") {
      nav.setOptions({ headerShown: false });
    }
  }, [nav]);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        404 - Page Not Found
      </Text>
      <Button title="Go Home" />
    </View>
  );
}
