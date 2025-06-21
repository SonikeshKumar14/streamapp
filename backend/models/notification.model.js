import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User receiving the notification
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who triggered the notification
    type: { type: String, enum: ["like", "comment", "reply"], required: true }, // Type of notification
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Associated post (optional for some types)
    message: { type: String }, // Optional, can be generated dynamically
    profilePicture: { type: String }, // Sender's profile picture (optional)
    read: { type: Boolean, default: false }, // ✅ Track if the notification has been read
}, { timestamps: true }); // ✅ Automatically adds createdAt & updatedAt

export default mongoose.model("Notification", notificationSchema);
