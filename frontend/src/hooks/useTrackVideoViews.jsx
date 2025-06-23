import { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const useTrackVideoViews = (videoId, onViewCounted) => {
  const videoRef = useRef(null);
  const [hasCounted, setHasCounted] = useState(false);
  // Add this effect to reset counter when video changes
  useEffect(() => {
    setHasCounted(false);
  }, [videoId])

  useEffect(() => {
    const currentVideo = videoRef.current;

    const handlePlay = async () => {
      if (!hasCounted && videoId) {
        try {
          const response = await axios.put(
            `https://streamapp-ufpw.onrender.com/api/v1/activity/${videoId}/view`,
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (onViewCounted) {
            onViewCounted(response?.data?.views);
          }
          setHasCounted(true);
        } catch (error) {
          console.error('View count error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
      }
    };

    if (currentVideo) {
      currentVideo.addEventListener('play', handlePlay);
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener('play', handlePlay);
      }
    };
  }, [videoId, onViewCounted, hasCounted]);

  return videoRef;
};

export default useTrackVideoViews;