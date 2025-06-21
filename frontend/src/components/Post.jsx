import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import useDeletePost from "@/hooks/useDeletePost";
import CreatePost from "./CreatePost";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { handleDeletePost, loading } = useDeletePost();

  const handleDelete = async (e) => {
    e.stopPropagation();
    handleDeletePost(post._id, () => setOpen(false));
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
    setOpen(false);
  };

  const handleCardClick = () => {
    if (!open) {
      navigate(`/video/${post._id}`);
    }
  };

  return (
    <Card
      className="bg-transparent border-none w-full cursor-pointer pt-0 relative"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={post?.thumbnailUrl}
          alt={post?.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="flex mt-3 space-x-3 relative">
        <Avatar>
          <AvatarImage src={post?.createdBy?.profilePicture} />
          <AvatarFallback>
            {post?.createdBy?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="text-black flex-1">
          <h3 className="text-lg font-semibold">{post?.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            @{post?.createdBy?.username}
          </p>
        </div>
        {user?.isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="absolute right-2 bottom-2 p-2 rounded-full hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <div className="space-y-4">
                {editMode ? (
                  <CreatePost
                    existingPost={post}
                    isEditMode={true}
                    onClose={handleCloseEdit}
                  />
                ) : (
                  <>
                    <div className="relative overflow-hidden rounded-lg my-2">
                      <img
                        src={post?.thumbnailUrl}
                        alt={post?.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarImage src={post?.createdBy?.profilePicture} />
                        <AvatarFallback>
                          {post?.createdBy?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-black flex-1">
                        <h3 className="text-lg font-semibold">{post?.title}</h3>
                        <p className="text-gray-400 text-sm">
                          @{post?.createdBy?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleEdit} className="flex-1">
                        Edit
                      </Button>
                      <Button 
                        onClick={handleDelete} 
                        className="flex-1" 
                        disabled={loading} 
                        variant="destructive"
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default Post;