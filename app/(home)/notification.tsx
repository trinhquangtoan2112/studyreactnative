import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import { COLORS } from "@/themes/Colors";
import { styles } from "@/utils/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";

export default function Notification() {
  const notifications = useQuery(api.notification.getNotifications);

  if (notifications === undefined) return <Loader></Loader>;
  if (notifications.length === 0)
    return <NoNotificationFound></NoNotificationFound>;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem notification={item}></NotificationItem>
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      ></FlatList>
    </View>
  );
}

function NoNotificationFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons
        name="notifications-outline"
        size={48}
        color={COLORS.primary}
      ></Ionicons>
      <Text style={{ color: COLORS.white, fontSize: 22 }}>
        No notification yet
      </Text>
    </View>
  );
}
function NotificationItem({ notification }: { notification: any }) {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Link href={`/user/${notification.sender._id}`} asChild>
          <TouchableOpacity>
            <Image
              source={notification.sender.image}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            ></Image>
            <View style={styles.iconBadge}>
              {notification.type === "like" ? (
                <Ionicons
                  name="heart"
                  size={14}
                  color={COLORS.primary}
                ></Ionicons>
              ) : notification.type === "follow" ? (
                <Ionicons
                  name="person-add"
                  size={14}
                  color="#8B5CF6"
                ></Ionicons>
              ) : (
                <Ionicons
                  name="chatbubble"
                  size={14}
                  color="#3B82F6"
                ></Ionicons>
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.notificationInfo}>
          <Link href={`/user/${notification.sender._id}`} asChild>
            <TouchableOpacity>
              <Text style={styles.username}>
                {notification.sender.username}
              </Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.action}>
            {notification.type === "follow"
              ? "Started following you"
              : notification.type === "like"
                ? "Liked your post"
                : `Commented:"${notification.comment}"`}
          </Text>
          <Text style={styles.timeAgo}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
      {notification.post && (
        <Image
          source={notification.post.imageURl}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
        ></Image>
      )}
    </View>
  );
}
