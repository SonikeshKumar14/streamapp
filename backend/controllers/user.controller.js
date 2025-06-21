import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";
import { deleteFromCloudinary } from "../db/cloudinaryUpload.js";

export const register = async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already in use."
            });
        }

        if (isAdmin) {
            const adminCount = await User.countDocuments({ isAdmin: true });
            if (adminCount > 0) {
                return res.status(403).json({
                    success: false,
                    message: "Only one admin is allowed."
                })
            }
        }

        await User.create({
            username,
            email,
            password,
            isAdmin
        });
        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        let user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            })
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            })
        }

        const admin = await User.findOne({ isAdmin: true });

        let adminVideos = [];
        if(admin){
            adminVideos = await Post.find({ createdBy: admin._id })
            .select("videoUrl thumbnailUrl createdAt")
            .sort({ createdAt: -1 });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            isAdmin: user.isAdmin,
            videos: adminVideos
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        return res.json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logout = async (__, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        return res.json({
            message: 'Logged out Successfully.',
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const editProfile = async (req, res) => {
    try {
       if(!req.user){
          return res.status(401).json({
            success: false,
            message: "Unauthorized: user not authenticated."
          });
       }

       const userId = req.user._id;
       const { bio, oldPassword, newPassword } = req.body;
      

       const user = await User.findById(userId).select('+password');
       if(!user){
          return res.status(404).json({
            message: 'User not found.',
            success: false
          })
       }

       if(bio) user.bio = bio;

       if(oldPassword && newPassword){
         const isMatch = await user.matchPassword(oldPassword);
         if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect."
            });
         }
         user.password = newPassword;
       }

       if(req.file){
          if(user.profilePicture){
            await deleteFromCloudinary(user.profilePicture, "image");
          }
          user.profilePicture = req.file.path;
       }

       await user.save();

       return res.status(200).json({
         message: "Profile updated.",
         success: true,
         user
       })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile successfully fetched.',
            user : {
                username: user.username,
                bio: user.bio || "",
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.stauts(404).json({
                success: false,
                message: "User not found."
            })
        }
        
        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
