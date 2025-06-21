import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../redux/postSlice";
import axios from "axios";

const Comment = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) return;

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/post/comment/${postId}`,
        { text: replyInput, parentComment: comment._id },
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
        setReplyInput("");
        setShowReplyBox(false);
      }
    } catch (error) {
      console.error("Error adding reply:", error.response?.data || error);
    }
  };

  return (
    <div className="bg-gray-700 p-3 rounded-lg text-white my-2">
      <p>{comment.text}</p>

      <button
        className="text-blue-400 text-sm mt-2"
        onClick={() => setShowReplyBox(!showReplyBox)}
      >
        Reply
      </button>

      {showReplyBox && (
        <div className="mt-2 ml-4">
          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
            placeholder="Write a reply..."
          />
          <button
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
            onClick={handleReplySubmit}
          >
            Submit
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <>
          <button 
            className="text-green-400 text-sm mt-2 ml-2" 
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
          </button>
          
          {showReplies && (
            <div className="ml-6 mt-3 border-l border-gray-500 pl-3">
              {comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;