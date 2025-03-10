import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/utils/feed.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import Loader from "./Loader";
import Comment from "./Comment";

type CommentModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};
export default function CommentModal({
  postId,
  visible,
  onClose,
  onCommentAdded,
}: CommentModal) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comment.getComment, { postId });
  const addComments = useMutation(api.comment.addComment);

  const handleAddComment = async () => {};
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white}></Ionicons>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <Text style={{ width: 24 }}></Text>
        </View>
        {comments === undefined ? (
          <Loader></Loader>
        ) : (
          <FlatList
            keyExtractor={(item) => item._id}
            data={comments}
            renderItem={({ item }) => <Comment comment={item}></Comment>}
          ></FlatList>
        )}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          ></TextInput>
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !newComment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
