import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';
import useFilteredPosts from '@/hooks/useFilteredPost';

const VideoFeed = ({ searchQuery }) => {
  // const { posts } = useSelector((store) => store.post);
  const filteredPosts = useFilteredPosts(searchQuery);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-16">
      {filteredPosts?.map((post) => (
        <Post key={post?._id} post={post} />
      ))}
    </div>
  )
}

export default VideoFeed;