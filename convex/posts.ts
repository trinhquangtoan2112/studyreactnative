import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const imageURl = await ctx.storage.getUrl(args.storageId);
    if (!imageURl) throw new Error("Image not found");
    const postId = await ctx.db.insert("posts", {
      userID: currentUser._id,
      imageURl,
      storageID: args.storageId,
      caption: args.caption,
      likes: 0,
      comment: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getFeedPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (posts.length === 0) return [];

    const postsWithSomeInfo = await Promise.all(
      posts.map(async (posts) => {
        const postAuthor = (await ctx.db.get(posts.userID))!;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", posts?._id)
          )
          .first();

        const bookmarks = await ctx.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (q) =>
            q.eq("postId", posts?._id).eq("userId", currentUser._id)
          )
          .first();
        return {
          ...posts,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
          },
          isLiked: !!like,
          isBookmarks: !!bookmarks,
        };
      })
    );
    return postsWithSomeInfo;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existing) {
      // remove like
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, { likes: post.likes - 1 });
      return false;
    } else {
      // add likes
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });

      await ctx.db.patch(args.postId, { likes: post.likes + 1 });

      if (currentUser._id !== post.userID) {
        await ctx.db.insert("notification", {
          receiverId: post.userID,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId,
        });
      }
      return true;
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const posts = await ctx.db.get(args.postId);
    if (!posts) throw new Error("Post not found");

    //verify ownership
    if (posts.userID !== currentUser._id)
      throw new Error("Not authorized to delete this post");

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    //delete storage file
    await ctx.storage.delete(posts.storageID);
    await ctx.db.delete(args.postId);

    //decrement user post count by 1

    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});
