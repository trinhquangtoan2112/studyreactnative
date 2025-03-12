import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import { styles } from "@/utils/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { Image } from "expo-image";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisble] = useState<boolean>(false);
  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: userId || "",
  });
  const [editProfile, setEditProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);

  const posts = useQuery(api.posts.getPostByUser, {});

  const updateProfile = useMutation(api.users.updateUserInfo);

  const handlerSaveProfile = async () => {
    await updateProfile(editProfile);
    setIsEditModalVisble(false);
  };
  if (!currentUser || posts === undefined) return <Loader></Loader>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              ></Image>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisble(true)}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons
                name="share-outline"
                size={20}
                color={COLORS.white}
              ></Ionicons>
            </TouchableOpacity>
          </View>
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
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisble(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisble(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={COLORS.white}
                  ></Ionicons>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editProfile.fullname}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholderTextColor={COLORS.grey}
                ></TextInput>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editProfile.bio}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.grey}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handlerSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

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
