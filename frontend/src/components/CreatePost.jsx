import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Video, ImageIcon } from "lucide-react";
import usePostForm from "@/hooks/usePostForm";

const CreatePost = ({ onClose, existingPost = null, isEditMode = false }) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    videoPreview,
    thumbnailPreview,
    handleFileChange,
    handleSubmit,
    loading,
  } = usePostForm({ existingPost, onClose, isEditMode });

  return (
    <Card className="w-full max-w-lg my-2">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          {isEditMode ? "Edit Post" : "Upload a Video"}
        </CardTitle>
      </CardHeader>

      <div className="max-h-[500px] overflow-y-auto px-4">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="my-2">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="my-2">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter post description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="video" className="flex items-center space-x-2 my-2">
                <Video className="w-5 h-5 text-blue-500" />
                <span>{isEditMode ? "Change Video (optional)" : "Upload Video"}</span>
              </Label>
              <Input 
                id="video" 
                type="file" 
                accept="video/*" 
                onChange={(e) => handleFileChange(e, "video")} 
                required={!isEditMode} 
              />
              {videoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Video:</p>
                  <video className="w-full rounded-lg" controls>
                    <source src={videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="thumbnail" className="flex items-center space-x-2 my-2">
                <ImageIcon className="w-5 h-5 text-green-500" />
                <span>{isEditMode ? "Change Thumbnail (optional)" : "Upload Thumbnail"}</span>
              </Label>
              <Input 
                id="thumbnail" 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, "thumbnail")} 
                required={!isEditMode} 
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Thumbnail:</p>
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full rounded-lg" />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full flex items-center space-x-2 cursor-pointer" disabled={loading}>
              {loading ? "Processing..." : <><UploadCloud className="w-5 h-5" /><span>{isEditMode ? "Update Post" : "Upload Post"}</span></>}
            </Button>
          </form>
        </CardContent>
      </div>
    </Card>
  );
};

export default CreatePost;