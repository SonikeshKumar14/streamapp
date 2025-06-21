import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { readFileAsDataURL } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const usePostForm = ({ existingPost = null, onClose, isEditMode = false }) => {
  const [title, setTitle] = useState(existingPost?.title || "");
  const [description, setDescription] = useState(existingPost?.description || "");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(existingPost?.videoUrl || null);
  const [thumbnailPreview, setThumbnailPreview] = useState(existingPost?.thumbnailUrl || null);
  const [loading, setLoading] = useState(false);

  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost?.title);
      setDescription(existingPost?.description);
      setVideoPreview(existingPost?.videoUrl);
      setThumbnailPreview(existingPost?.thumbnailUrl);
    }
  }, [existingPost]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.error("Video size exceeds 50MB limit");
      return;
    }
    if (type === "thumbnail" && file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail size exceeds 5MB limit");
      return;
    }

    try {
      const dataURL = await readFileAsDataURL(file);
      if (type === "video") {
        setVideo(file);
        setVideoPreview(dataURL);
      } else {
        setThumbnail(file);
        setThumbnailPreview(dataURL);
      }
    } catch (error) {
      toast.error("Failed to process file");
      console.error("File processing error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (!isEditMode && (!video || !thumbnail)) {
      toast.error("Both video and thumbnail are required for new posts");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    // Only append files if they exist
    if (video) formData.append("video", video);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${API_BASE_URL}/post/edit/${existingPost?._id}`,
          formData,
          config
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/post/upload`,
          formData,
          config
        );
      }

      if (response.data.success) {
        if (isEditMode) {
          dispatch(setPosts(
            posts.map(post => 
              post._id === existingPost._id ? response?.data?.post : post
            )
          ));
          toast.success("Post updated successfully");
        } else {
          dispatch(setPosts([response.data.post, ...posts]));
          toast.success("Post created successfully");
        }

        if (!isEditMode) {
          setTitle("");
          setDescription("");
          setVideo(null);
          setThumbnail(null);
          setVideoPreview(null);
          setThumbnailPreview(null);
        }
        onClose();
      }
    } catch (error) {
      console.error("API Error:", error);
      
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Post not found or you don't have permission");
        } else if (error.response.status === 401) {
          toast.error("Session expired - please login again");
        } else {
          toast.error(error.response.data.message || "Server error occurred");
        }
      } else if (error.request) {
        toast.error("Network error - check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    videoPreview,
    thumbnailPreview,
    handleFileChange,
    handleSubmit,
    loading,
    video,
    thumbnail,
  };
};

export default usePostForm;