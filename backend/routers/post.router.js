import express from 'express';
import { deleteVideo, editPost, getAllPost, uploadPost } from '../controllers/post.controller.js';
import { uploadFields } from '../db/cloudinaryUpload.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/upload").post(verifyToken, uploadFields, uploadPost);
router.route("/edit/:id").put(verifyToken, uploadFields, editPost);
router.route("/delete/:id").delete(verifyToken, deleteVideo);
router.route("/all").get(verifyToken, getAllPost);
export default router;