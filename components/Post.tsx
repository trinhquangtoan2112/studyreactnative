/* eslint-disable @typescript-eslint/no-explicit-any */
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "@/utils/feed.style";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/themes/Colors";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentModal from "./CommentModal";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-react";
import { deletePost } from "@/convex/posts";

interface Props {
  post: {
    _id: Id<"posts">;
    imageURl: string;
    //  storageID: v.id("_storage"),
    caption?: string;
    likes: number;
    comment: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
}

export default function Post({ post }: Props) {
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [commentCount, setCommentCount] = useState<number>(post.comment);
  const [showComment, setShowComment] = useState<boolean>(false);
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.Bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);
  const { user } = useUser();
  console.log(user);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );
  const handleLike = async () => {
    try {
      const newsIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newsIsLiked);

      setLikeCount((prev) => (newsIsLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.log(error);
    }
  };
  const handleBookmark = async () => {
    try {
      const newIsBookmark = await toggleBookmark({ postId: post._id });
      setIsBookmark(newIsBookmark);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (error) {}
  };
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href={"/(home)/notification"}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            ></Image>
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        {post.author._id === currentUser?._id ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={COLORS.primary}
            ></Ionicons>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
        )}

        {/* Image */}
      </View>
      <Image
        source={post.imageURl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy={"memory-disk"}
      ></Image>
      <View style={styles.postAction}>
        <View style={styles.postActionLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComment(true)}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmark ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmark ? COLORS.primary : COLORS.white}
          ></Ionicons>
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likeCount > 0
            ? `${likeCount.toLocaleString()} likes`
            : "Be the first to like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        {commentCount > 0 && (
          <TouchableOpacity onPress={() => setShowComment(true)}>
            <Text style={styles.commentText}>
              View all {commentCount} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>

      <CommentModal
        postId={post._id}
        visible={showComment}
        onClose={() => setShowComment(false)}
        onCommentAdded={() => setCommentCount((prev) => prev + 1)}
      ></CommentModal>
    </View>
  );
}
