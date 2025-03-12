import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import { COLORS } from "@/themes/Colors";
import { styles } from "@/utils/feed.style";
import { Image } from "expo-image";

export default function Bookmarks() {
  const bookmarkPosts = useQuery(api.Bookmarks.getBookmark);

  if (bookmarkPosts === undefined) return <Loader></Loader>;

  if (bookmarkPosts.length === 0) return <NoBookmarkFound></NoBookmarkFound>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkPosts.map((item) => {
          if (!item) return null;
          return (
            <View key={item?._id} style={{ width: "33.33%", padding: 1 }}>
              <Image
                source={item.imageURl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              ></Image>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
function NoBookmarkFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No bookmark posts yet
      </Text>
    </View>
  );
}
