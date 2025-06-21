import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { addComment, dislikePost, getLikedVideos, getReplies, incrementViewCount, likePost } from '../controllers/userActivity.controller.js';
import { getLikeNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.route("/like/:id").put(verifyToken, likePost);
router.route("/dislike/:id").put(verifyToken, dislikePost);
router.route("/notifications").get(verifyToken, getLikeNotifications);
router.route("/comment/:id").post(verifyToken, addComment);
router.route("/comments/:id/replies").get(getReplies);
router.route("/:id/view").put(incrementViewCount);
router.route("/liked-users").get(getLikedVideos);

export default router;
