import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { styles } from "@/utils/feed.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import Post from "@/components/Post";

export default function Home() {
  const { signOut } = useAuth();
  const handlerSignOut = () => {
    signOut();
  };

  const StoriesSection = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal
        style={styles.storiesContainer}
      >
        {STORIES.map((story) => {
          return <Story key={story.id} story={story}></Story>;
        })}
      </ScrollView>
    );
  };
  const post = useQuery(api.posts.getFeedPosts);
  if (post === undefined) return <Loader></Loader>;
  // if (post.length === 0) return <NotFound></NotFound>;
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotlight</Text>
        <TouchableOpacity onPress={handlerSignOut}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={COLORS.white}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      {/* body */}
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal
          style={styles.storiesContainer}
        >
          {STORIES.map((story) => {
            return <Story key={story.id} story={story}></Story>;
          })}
        </ScrollView>
        {post?.map((post) => <Post key={post._id} post={post}></Post>)}
      </ScrollView> */}

      <FlatList
        data={post}
        renderItem={({ item }) => {
          return <Post post={item}></Post>;
        }}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />}
      ></FlatList>
    </View>
  );
}
