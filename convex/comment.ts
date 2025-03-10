import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const posts = await ctx.db.get(args.postId);
    if (!posts) throw new ConvexError("Post not found");

    const commentId = await ctx.db.insert("comments", {
      userId: currentUser?._id,
      postId: args.postId,
      content: args.content,
    });

    await ctx.db.patch(args.postId, { comment: posts.comment + 1 });

    if (posts.userID != currentUser._id) {
      await ctx.db.insert("notification", {
        receiverId: posts.userID,
        senderId: currentUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }
  },
});

export const getComment = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const commentWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            fullname: user!.fullname,
            image: user!.image,
          },
        };
      })
    );
    return commentWithInfo;
  },
});
