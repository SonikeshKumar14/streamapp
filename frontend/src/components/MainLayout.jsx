import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import Topnav from "./Topnav";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUser, setLoadingUser] = useState(true); // ⬅️ NEW: Track loading state

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user && token) {
      axios.get("http://localhost:8000/api/v1/user/me", {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(setAuthUser(res.data.user));
        console.log("✅ Auto-login success:", res?.data?.user);
      })
      .catch((err) => {
        console.error("❌ Auto-login failed:", err.response?.data || err.message);
        localStorage.removeItem("token"); // ⬅️ Remove invalid token
        navigate("/login");
      })
      .finally(() => {
        setLoadingUser(false); // ✅ Done loading user
      });
    } else {
      setLoadingUser(false); // ✅ No token/user, also done loading
    }
  }, [user, dispatch, navigate]);

  const hideTopnav = location.pathname.startsWith("/profile");

  // 🔐 Prevent rendering app until we check if user is logged in or not
  if (loadingUser) {
    return <div className="h-screen w-screen flex items-center justify-center">Checking login...</div>;
  }

  return (
    <div className="flex flex-col h-screen relative">
      {!hideTopnav && (
        <Topnav toggleSidebar={() => setCollapsed(!collapsed)} setSearchQuery={setSearchQuery} />
      )}
      <div className="flex flex-1 relative">
        <div className="fixed left-0 top-0 h-screen z-50 transition-all duration-300">
          <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <div
          className={`flex-1 w-full overflow-y-auto p-4 transition-all duration-300 ml-16
            ${!collapsed ? "filter blur-[4px]" : ""}`}
        >
          <Outlet context={{ searchQuery }} />
        </div>

        {!collapsed && (
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setCollapsed(true)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
