import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LikedVideosTable = () => {
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    fetchLikedUsers();
  }, []);

  const fetchLikedUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/activity/liked-users");

      if (data.success) {
        setLikedUsers(data?.likedUsers);
      } else {
        console.error("Failed to fetch liked videos:", data?.message);
      }
    } catch (error) {
      console.error("Error fetching liked videos:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {/* Increased max width to 7xl for more width */}
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-8 overflow-x-auto">
        {/* Title Centered */}
        <h2 className="text-3xl font-semibold text-center mb-6">Users Who Liked Videos</h2>

        {/* Responsive Table */}
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="text-center p-4 text-lg">Profile Picture</TableHead>
              <TableHead className="text-center p-4 text-lg">Username</TableHead>
              <TableHead className="text-center p-4 text-lg">Liked Video Title</TableHead>
              <TableHead className="text-center p-4 text-lg">Video Thumbnail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {likedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center p-6 text-lg">
                  No liked videos found
                </TableCell>
              </TableRow>
            ) : (
              likedUsers.map((user, index) => (
                <TableRow key={index} className="text-center">
                  {/* Profile Picture */}
                  <TableCell className="p-4">
                    <img
                      src={user?.profilePicture || "/default-avatar.png"}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                  </TableCell>

                  {/* Username */}
                  <TableCell className="p-4 font-medium text-lg">{user?.username}</TableCell>

                  {/* Liked Video Title */}
                  <TableCell className="p-4 text-lg">{user?.videoTitle || "N/A"}</TableCell>

                  {/* Video Thumbnail */}
                  <TableCell className="p-4">
                    <img
                      src={user?.videoThumbnail || "/default-thumbnail.png"}
                      alt="Thumbnail"
                      className="w-24 h-16 rounded object-cover mx-auto"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LikedVideosTable;
