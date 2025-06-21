import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import { deleteFromCloudinary } from "../db/cloudinaryUpload.js";
import { sendNotification } from "./notification.controller.js";

export const uploadPost = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can upload videos.",
            });
        }

        if (!req.files || !req.files?.video || !req.files?.thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Both video and thumbnail are required."
            })
        }

        const { title, description } = req.body;

        const newPost = new Post({
            title,
            description,
            videoUrl: req.files.video[0].path,
            thumbnailUrl: req.files.thumbnail[0].path,
            createdBy: req.user._id,
        });

        await newPost.save();

        // Populate createdBy field with username and profilePicture
        const populatedPost = await Post.findById(newPost._id)
            .populate("createdBy", "username profilePicture");

        res.status(201).json({
            success: true,
            message: "Video uploaded successfully.",
            post: populatedPost
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const editPost = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can edit videos."
            });
        }

        const { id } = req.params;
        const { title, description } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        console.log("Incoming Files:", req.files);

        const oldVideoUrl = post.videoUrl;
        const oldThumbnailUrl = post.thumbnailUrl;

        if (req.files?.video) {
            console.log("Deleting old videos:", oldVideoUrl);
            await deleteFromCloudinary(oldVideoUrl, "video");
            post.videoUrl = req.files.video[0].path;
        }

        if (req.files?.thumbnail) {
            console.log("Deleting old thumbnail:", oldThumbnailUrl);
            await deleteFromCloudinary(oldThumbnailUrl, "image");
            post.thumbnailUrl = req.files.thumbnail[0].path;
        }

        post.title = title || post.title;
        post.description = description || post.description;

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("createdBy", "username profilePicture");

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: populatedPost
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete videos."
            });
        }

        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Video not found."
            });
        }

        if (post.videoUrl) {
            await deleteFromCloudinary(post.videoUrl, "video");
        }

        if (post.thumbnailUrl) {
            await deleteFromCloudinary(post.thumbnailUrl, "image");
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "username profilePicture")
            .populate("likes", "username profilePicture")
            .populate({
                path: "comments",
                match: { parentComment: null },
                populate: [
                    { path: "author", select: "username profilePicture" },
                    {
                        path: "replies",
                        populate: [
                            { path: "author", select: "username profilePicture" },
                            { path: "replies" }
                        ]
                    }
                ]
            });

        return res.status(200).json({ success: true, posts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


