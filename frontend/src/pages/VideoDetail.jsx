import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateLikes, incrementViews } from "../redux/postSlice";
import VideoPlayer from "../components/VideoPlayer";
import SuggestedVideos from "../components/SuggestedVideos";
import CommentSection from "../components/CommentSection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Share2, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const foundVideo = posts.find((post) => post._id === videoId);
      setVideo(foundVideo);

      if (user && foundVideo) {
        setLiked(foundVideo.likes.includes(user._id));
        setDisliked(foundVideo.dislikes.includes(user._id));
      }
    }
  }, [videoId, posts, user]);

  // In VideoDetail.js
  const handleViewCounted = (newViewCount) => {
    if (video) {
      dispatch(incrementViews({ postId: video._id, views: newViewCount }));
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like videos");
      return;
    }

    setLoading(true);
    try {
      // Optimistic UI update
      const newLikedState = !liked;
      setLiked(newLikedState);
      if (newLikedState) setDisliked(false);

      await axios.put(
        `http://localhost:8000/api/v1/activity/like/${video._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      dispatch(
        updateLikes({
          postId: video._id,
          userId: user._id,
          isLike: newLikedState,
          isDislike: false,
        })
      );
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert UI on error
      setLiked(!liked);
      toast.error("Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("Please login to dislike videos");
      return;
    }

    setLoading(true);
    try {
      // Optimistic UI update
      const newDislikedState = !disliked;
      setDisliked(newDislikedState);
      if (newDislikedState) setLiked(false);

      await axios.put(
        `http://localhost:8000/api/v1/activity/dislike/${video._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      dispatch(
        updateLikes({
          postId: video._id,
          userId: user._id,
          isLike: false,
          isDislike: newDislikedState,
        })
      );
    } catch (error) {
      console.error("Error updating dislikes:", error);
      // Revert UI on error
      setDisliked(!disliked);
      toast.error("Failed to update dislike");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let [unit, seconds] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / seconds);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now"; // For very recent uploads
  };

  if (!video) return <div className="p-6">Loading video...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <VideoPlayer video={video} onViewCounted={handleViewCounted} />
          <h1 className="text-2xl font-bold mt-2">{video?.title}</h1>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={video?.createdBy?.profilePicture} />
              </Avatar>
              <div>
                <span className="font-bold block">
                  @{video.createdBy?.username}
                </span>
                <span className="text-gray-400 text-sm">
                  {getTimeAgo(video?.createdAt)} • {video?.views || 0} views
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-full transition ${
                  liked
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-5 h-5" /> {video?.likes?.length || 0}
              </button>

              <button
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-full transition ${
                  disliked
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                onClick={handleDislike}
              >
                <ThumbsDown className="w-5 h-5" /> {video?.dislikes?.length || 0}
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 className="w-5 h-5" /> Share
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-300">{video?.description}</p>
          </div>

          <div className="mt-8">
            <CommentSection postId={video?._id} />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h2 className="font-bold text-xl mb-4">More Videos</h2>
          <SuggestedVideos currentVideoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
