import mongoose from "mongoose";
import { checkAdminLimit, hashPassword, matchPassword } from "../utils/userUtils.js";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// hash password before saving
userSchema.pre("save", hashPassword);

// Ensure only one admin exists
userSchema.pre("save", checkAdminLimit);

// Method to compare passwords
userSchema.methods.matchPassword = matchPassword;

const User = mongoose.model("User", userSchema);
export default User;