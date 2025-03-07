import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-react";
import { styles } from "@/utils/create.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as FileSystem from "expo-file-system";
export default function Create() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  console.log(221);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    if (!selectedImage) return;
    try {
      setIsSharing(true);
      const uploadURL = await generateUploadUrl();
      const uploadResult = await FileSystem.uploadAsync(
        uploadURL,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        }
      );

      if (uploadResult.status !== 200) throw new Error("Upload failed");

      const { storageId } = JSON.parse(uploadResult.body);

      await createPost({ storageId, caption });
      router.push("/(home)");
    } catch (error) {
      console.log(error, "Error sharing post");
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              console.log(1122);
            }}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={COLORS.primary}
            ></Ionicons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New posts</Text>
          <View style={{ width: 28 }}></View>
        </View>
        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons
            name="image-outline"
            size={48}
            color={COLORS.grey}
          ></Ionicons>
          <Text style={styles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.contentContainer}>
        {/*Header*/}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption("");
            }}
            disabled={isSharing}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[
              styles.sharedButton,
              isSharing && styles.sharedButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
              ></ActivityIndicator>
            ) : (
              <Text style={styles.sharedText}>Shared</Text>
            )}
          </TouchableOpacity>
        </View>
        {/*Body*/}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            {/*Image section */}
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons
                  name="image-outline"
                  size={20}
                  color={COLORS.white}
                ></Ionicons>
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>
            {/*Input section */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.usedAvatar}
                  contentFit="cover"
                  transition={200}
                ></Image>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption"
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                ></TextInput>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
