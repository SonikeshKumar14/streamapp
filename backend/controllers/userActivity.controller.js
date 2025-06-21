import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const addComment = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { text, parentComment } = req.body;
        const userId = req.user._id;

        if (!text.trim()) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const newComment = new Comment({
            text,
            author: userId,
            post: id,
            parentComment: parentComment || null, // ✅ Allows nesting
        });

        await newComment.save();

        if (parentComment) {
            // ✅ If it's a reply, add it to the parent comment
            const parent = await Comment.findById(parentComment);
            if (parent) {
                parent.replies.push(newComment._id);
                await parent.save();
            }
        } else {
            // ✅ If it's a top-level comment, add to post
            post.comments.push(newComment._id);
            await post.save();
        }

        // ✅ Populate author before sending response
        const populatedComment = await newComment.populate("author", "username profilePicture");

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment,
        });

    } catch (error) {
        console.error("🚨 Error adding comment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userId = req.user._id;
        const likeIndex = post.likes.indexOf(userId);
        const dislikeIndex = post.dislikes.indexOf(userId);

        if (likeIndex === -1) {
            // Add like
            post.likes.push(userId);
            // Remove dislike if exists
            if (dislikeIndex !== -1) {
                post.dislikes.splice(dislikeIndex, 1);
            }
        } else {
            // Remove like
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userId = req.user._id;
        const dislikeIndex = post.dislikes.indexOf(userId);
        const likeIndex = post.likes.indexOf(userId);

        if (dislikeIndex === -1) {
            // Add dislike
            post.dislikes.push(userId);
            // Remove like if exists
            if (likeIndex !== -1) {
                post.likes.splice(likeIndex, 1);
            }
        } else {
            // Remove dislike
            post.dislikes.splice(dislikeIndex, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const getReplies = async (req, res) => {
    try {
        const { id } = req.params; // Parent comment ID

        const comment = await Comment.findById(id)
            .populate({
                path: "replies",
                populate: { path: "author", select: "username profilePicture" }
            });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        return res.status(200).json({ success: true, replies: comment.replies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const incrementViewCount = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ views: post.views });
    } catch (error) {
        res.status(500).json({ error: "Failed to increment views" });
    }
};

// GET /api/v1/post/search?query=keyword
export const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        const posts = await Post.find({
            title: { $regex: query, $options: 'i' } // Case-insensitive search
        }).populate("author", "username profilePicture");

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getLikedVideos = async (req, res) => {
    try {
        // Find posts that have likes
        const likedPosts = await Post.find({ likes: { $exists: true, $ne: [] } })
            .populate("createdBy", "username profilePicture") // Get author details
            .populate("likes", "username profilePicture"); // Get users who liked the video

        // Transform data to include liked users & videos
        const formattedData = [];
        likedPosts.forEach(post => {
            post.likes.forEach(user => {
                formattedData.push({
                    username: user.username,
                    profilePicture: user.profilePicture || "/default-avatar.png",
                    videoTitle: post.title,
                    videoThumbnail: post.thumbnailUrl || "/default-thumbnail.png"
                });
            });
        });

        res.status(200).json({ success: true, likedUsers: formattedData });
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
