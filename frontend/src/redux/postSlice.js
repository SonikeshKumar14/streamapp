import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
  },
  reducers: {
    // Add setPosts reducer
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    
    updateLikes: (state, action) => {
      const { postId, userId, isLike, isDislike } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      
      if (post) {
        if (!post.likes) post.likes = [];
        if (!post.dislikes) post.dislikes = [];
        
        if (isLike !== undefined) {
          const likeIndex = post.likes.findIndex(id => id.toString() === userId.toString());
          
          if (isLike) {
            if (likeIndex === -1) {
              post.likes.push(userId);
              post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
            }
          } else {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
          }
        }
        
        if (isDislike !== undefined) {
          const dislikeIndex = post.dislikes.findIndex(id => id.toString() === userId.toString());
          
          if (isDislike) {
            if (dislikeIndex === -1) {
              post.dislikes.push(userId);
              post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            }
          } else {
            post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
          }
        }
      }
    },
 
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      
      if (post) {
        if (!post.comments) post.comments = [];
        
        if (!comment.parentComment) {
          post.comments.push(comment);
        } else {
          const addReplyToComment = (comments) => {
            for (let c of comments) {
              if (c._id === comment.parentComment) {
                if (!c.replies) c.replies = [];
                c.replies.push(comment);
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (addReplyToComment(c.replies)) return true;
              }
            }
            return false;
          };
          addReplyToComment(post.comments);
        }
      }
    },
    updateComments: (state, action) => {
      const { postId, comments } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments = comments;
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
    incrementViews: (state, action) => {
      const { postId, views } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.views = views; // Make sure this is updating the views
      }
    }
  },
});

// Export ALL action creators
export const { 
  setPosts, 
  updateLikes, 
  addComment, 
  updateComments, 
  deletePost,
  incrementViews
} = postSlice.actions;

export default postSlice.reducer;