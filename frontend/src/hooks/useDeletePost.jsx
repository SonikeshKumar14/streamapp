import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { deletePost } from "@/redux/postSlice";

const useDeletePost = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDeletePost = async (postId, onSuccess) => {
    setLoading(true);
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${postId}`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(deletePost(postId)); // Update Redux store
        toast.success("Post deleted successfully!");
        if(onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeletePost, loading };
};

export default useDeletePost;
