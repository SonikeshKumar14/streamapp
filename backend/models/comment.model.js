import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment", 
      default: null 
    },
    replies: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment" 
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Middleware to delete replies when a parent comment is deleted
commentSchema.pre("findOneAndDelete", async function (next) {
  const comment = await this.model.findOne(this.getFilter());
  
  if (comment) {
    await mongoose.model("Comment").deleteMany({ parentComment: comment._id });
  }

  next();
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
