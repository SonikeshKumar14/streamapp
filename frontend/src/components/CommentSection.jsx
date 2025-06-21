import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../redux/postSlice";
import axios from "axios";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const post = useSelector(state => 
    state.post.posts.find(p => p._id === postId)
  );
  const [commentInput, setCommentInput] = useState("");

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/post/comment/${postId}`,
        { text: commentInput },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(addComment({
          postId,
          comment: {
            ...data.comment,
            replies: []
          }
        }));
        setCommentInput("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl mb-4">Comments</h2>
      <hr />
      <br />
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
          placeholder="Add a comment..."
        />
        <button
          className="bg-gray-700 text-white font-bold px-4 py-2 rounded-full hover:bg-gray-600 transition"
          onClick={handleCommentSubmit}
        >
          Comment
        </button>
      </div>

      {post?.comments?.filter(comment => !comment.parentComment).map((comment) => (
        <Comment key={comment._id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentSection;