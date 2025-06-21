import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({ success: false, message: "Unauthorized access."});
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decode.userId).select("-password");

    if(!req.user){
      return res.status(401).json({ success: false, message: "User not found."});
    }

    next();
  } catch (error) {
     res.status(401).json({ success: false, message: "Invalid token" })
  }
}