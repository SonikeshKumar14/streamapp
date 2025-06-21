import mongoose from "mongoose";
import Comment from "./comment.model.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Middleware to delete associated comments when a post is deleted
postSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const postId = this.getQuery()._id;
  await Comment.deleteMany({ post: postId });
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;