import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function Home() {
  const { signOut } = useAuth();
  const handlerSignOut = () => {
    signOut();
  };
  return (
    <View>
      <TouchableOpacity onPress={handlerSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
