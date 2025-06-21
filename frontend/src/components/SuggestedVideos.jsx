import React from "react"
import { useSelector } from "react-redux"
import Post from "./Post"

const SuggestedVideos = ({ currentVideoId = null }) => {
  const { posts } = useSelector((store) => store.post)
  
  const suggestedVideos = currentVideoId 
    ? posts.filter(post => post._id !== currentVideoId)
    : []

  return (
    <div className="space-y-4">
      <p className="text-white bg-gray-800 rounded-lg inline-block px-4 py-2 hover:bg-gray-700 font-bold cursor-default">Suggested Video</p>
      {suggestedVideos?.map((video) => (
        <Post key={video._id} post={video} />
      ))}
    </div>
  )
}

export default SuggestedVideos;