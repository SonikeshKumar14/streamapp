export const sendNotification = async ({ recipient, sender, type, post = null, message, profilePicture = "" }) => {
    try {
        if(!recipient || !sender){
            console.log("sendNotification: Missing recipient or sender.");
            return;
        }
        if (recipient.toString() === sender.toString()) return; // Don't notify self

        const notification = new Notification({
            recipient,
            sender,
            type,
            post,
            message,
            profilePicture,
        });

        await notification.save();
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export const getLikeNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID

        // Fetch notifications where the recipient is the user and type is "like"
        const notifications = await Notification.find({ recipient: userId, type: "like" })
            .populate("sender", "username profilePicture") // Get sender details
            .populate("post", "title") // Get post title if available
            .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching like notifications:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
