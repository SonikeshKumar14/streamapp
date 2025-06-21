import React from "react";
import useTrackVideoViews from "@/hooks/useTrackVideoViews";

const VideoPlayer = ({ video, onViewCounted }) => {
  const videoRef = useTrackVideoViews(video?._id, onViewCounted);
  
  if (!video) return null;

  return (
    <div className="bg-black rounded-lg overflow-hidden mt-10">
      <div className="relative pt-[50%]">
        <video
          controls
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full"
          src={video?.videoUrl}
          poster={video?.thumbnailUrl}
          onClick={(e) => e.stopPropagation()} // Add this line
        />
      </div>
    </div>
  );
};

export default VideoPlayer;