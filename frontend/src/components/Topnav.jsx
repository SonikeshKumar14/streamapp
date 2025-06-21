import { MenuIcon, Search } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Topnav = ({ toggleSidebar, setSearchQuery }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  return (
    <div className="flex items-center bg-black text-white p-4 shadow-md fixed w-full z-30">
      <MenuIcon size={28} className="cursor-pointer" onClick={toggleSidebar} />
      <h1 className="text-xl font-bold ml-8">MyTube</h1>
      <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full w-1/3 mx-auto">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-white flex-1"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search size={20} className="text-gray-400" />
      </div>
      <Avatar onClick={() => navigate(`/profile/${user?._id}`)} className="w-8 h-8 cursor-pointer" >
        <AvatarImage src={user?.profilePicture}/>
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Topnav;
