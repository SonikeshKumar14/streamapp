import {
  History,
  Home,
  LogOut,
  Subscript,
  Menu as MenuIcon,
  PlusSquare,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Dialog, DialogContent } from "./ui/dialog";

const LeftSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://streamapp-ufpw.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Base sidebar items for all users
  const baseSidebarItems = [
    { icon: <Home size={24} />, text: "Home", onClick: () => navigate("/") },
    { icon: <Subscript size={24} />, text: "Subscriptions",  },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="User Profile" />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      onClick: () => navigate(`/profile/${user?._id}`)
    },
    { icon: <History size={24} />, text: "History", },
    { icon: <LogOut size={24} />, text: "Logout", onClick: logoutHandler }
  ];

  // Admin-only sidebar items
  const adminSidebarItems = [
    { icon: <PlusSquare size={24} />, text: "Create", onClick: () => setIsCreatePostOpen(true) }
  ];

  // Combine items based on user role
  const sidebarItems = [
    ...baseSidebarItems.slice(0, 1), // Home
    ...(user?.isAdmin ? adminSidebarItems : []), // Admin items (only Create)
    ...baseSidebarItems.slice(1) // Remaining base items (including Subscriptions)
  ];

  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 
        ${collapsed ? "w-[72px]" : "w-[240px] bg-gray-900"} overflow-hidden`}
    >
      <Sidebar
        collapsed={collapsed}
        className="h-full text-white"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#1e2939",
          },
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              color: "white",
              "&:hover": {
                backgroundColor: "#374151"
              }
            }
          }}
        >
          <MenuItem
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer mt-[11px]"
            icon={<MenuIcon />}
          >
            {!collapsed && <span className="text-xl font-bold">MyTube</span>}
          </MenuItem>
          {sidebarItems.map((item, index) => (
            <MenuItem
              onClick={item.onClick}
              key={index}
              icon={item.icon}
            >
              {!collapsed && item.text}
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>

      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} modal={false}>
        <DialogContent className="!overflow-visible">
          <CreatePost onClose={() => setIsCreatePostOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftSidebar;