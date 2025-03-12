import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import { styles } from "@/utils/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { Image } from "expo-image";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const profile = useQuery(api.users.getUserProfile, { id: id as Id<"users"> });
  const posts = useQuery(api.posts.getPostByUser, {
    userId: id as Id<"users">,
  });

  const router = useRouter();
  const isFollowing = useQuery(api.users.isFollowing, {
    followingId: id as Id<"users">,
  });
  const toggleFollow = useMutation(api.users.toggleFollow);

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else {
      router.replace("/(home)");
    }
  };

  if (profile === undefined || posts === undefined || isFollowing === undefined)
    return <Loader></Loader>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white}></Ionicons>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={profile.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              ></Image>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <Pressable
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>

        {posts.length === 0 && <NoPostFound></NoPostFound>}
        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() => setSelectedPost(item)}
              >
                <Image
                  source={item.imageURl}
                  style={styles.gridImage}
                  contentFit="cover"
                  transition={200}
                ></Image>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </ScrollView>

      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedPost(null)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={COLORS.white}
                  ></Ionicons>
                </TouchableOpacity>
              </View>
              <Image
                source={selectedPost.imageURl}
                cachePolicy={"memory-disk"}
                style={styles.postDetailImage}
              ></Image>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

function NoPostFound() {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="images-outline"
        size={48}
        color={COLORS.primary}
      ></Ionicons>
      <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
    </View>
  );
}
