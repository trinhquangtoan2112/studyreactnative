import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { styles } from "@/utils/feed.style";

type Story = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};
export default function Story({ story }: { story: Story }) {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image
          source={{ uri: story.avatar }}
          style={styles.storyAvatar}
        ></Image>
      </View>
      <Text style={styles.storyUserName}>{story.username}</Text>
    </TouchableOpacity>
  );
}
