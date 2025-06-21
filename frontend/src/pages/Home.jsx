import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import VideoFeed from '@/components/VideoFeed'
import useGetAllPost from '@/hooks/useGetAllPost'


const Home = () => {
  useGetAllPost()
  const { searchQuery } = useOutletContext();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        {/* {window.location.pathname === '/' ? <VideoFeed /> : <Outlet />} */}
        <VideoFeed searchQuery={searchQuery}/>
      </div>
    </div>
  )
}

export default Home;