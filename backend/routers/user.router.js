import express from "express";
import { deleteProfile, editProfile, getProfile, login, logout, register, getCurrentUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../db/cloudinaryUpload.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/edit/profile').put(verifyToken, upload.single('profilePicture'), editProfile);
router.route('/profile/:id').get(getProfile);
router.route('/delete').delete(verifyToken, deleteProfile);
router.route('/me').get(verifyToken, getCurrentUser);

export default router;