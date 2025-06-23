import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LikedVideosTable from "@/components/LikedVideos";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log("User", user);
  
  if(!user){
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    oldPassword: "",
    newPassword: "",
    profilePicture: user?.profilePicture || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch user profile from the backend
  useEffect(() => {
    if(!user?._id) return;
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `https://streamapp-ufpw.onrender.com/api/v1/user/profile/${user?._id}`
        );
        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            username: data?.user?.username,
            bio: data?.user.bio,
            profilePicture: data?.user?.profilePicture,
          }));
        }
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    if (user?._id) {
      fetchProfile();
    }
  }, [user?._id]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData?.username);
      formDataToSend.append("bio", formData?.bio);
      if (formData.oldPassword && formData?.newPassword) {
        formDataToSend.append("oldPassword", formData?.oldPassword);
        formDataToSend.append("newPassword", formData?.newPassword);
      }
      if (formData.profilePicture instanceof File) {
        formDataToSend.append("profilePicture", formData?.profilePicture);
      }

      const { data } = await axios.put(
        "https://streamapp-ufpw.onrender.com/api/v1/user/edit/profile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success(data?.message);
        dispatch(setAuthUser(data?.user));

        // **Update state immediately with the new profile picture**
        setFormData((prev) => ({
          ...prev,
          profilePicture: data?.user?.profilePicture, // Assuming the backend returns the updated profile picture URL
        }));

        setOpen(false);
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("https://streamapp-ufpw.onrender.com/api/v1/user/delete", {
        withCredentials: true,
      });

      // Clear Redux state
      dispatch(setAuthUser(null));

      // Redirect user to login page
      navigate("/login");
    } catch (error) {
      console.error(
        "Error deleting account:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Profile Section */}
      <div className="text-center">
        <img
          src={formData?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <h2 className="text-xl font-semibold mt-2">{formData?.username}</h2>
        <p className="text-gray-600">{formData?.bio}</p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <Label>Username</Label>
              <Input
                name="username"
                value={formData?.username}
                onChange={handleChange}
              />

              <Label>Bio</Label>
              <Input name="bio" value={formData?.bio} onChange={handleChange} />

              <Label>Old Password</Label>
              <Input
                name="oldPassword"
                type="password"
                value={formData?.oldPassword}
                onChange={handleChange}
              />

              <Label>New Password</Label>
              <Input
                name="newPassword"
                type="password"
                value={formData?.newPassword}
                onChange={handleChange}
              />

              <Label>Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      profilePicture: file,
                    }));
                  }
                }}
              />

              <Button type="submit" className="mt-4" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Button */}
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
      {
        user.isAdmin && <LikedVideosTable />
      }
      
    </div>
  );
};

export default Profile;
