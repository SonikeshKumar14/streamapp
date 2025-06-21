import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteFromCloudinary = async (fileUrl, type) => {
    if (!fileUrl) return;

    try {
        const matches = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        if (!matches || matches.length < 2) {
            console.log("❌ Failed to extract public_id from URL:", fileUrl);
            return;
        }

        let public_id = matches[1];

        public_id = decodeURIComponent(public_id);

        console.log(`🔴 Deleting from Cloudinary: ${public_id} (Type: ${type})`);

        const result = await cloudinary.v2.uploader.destroy(public_id, {
            resource_type: type, 
            invalidate: true,
        });

        console.log("✅ Cloudinary Delete Result:", result);
    } catch (error) {
        console.log("❌ Error deleting from Cloudinary:", error);
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
        const fileType = file.mimetype.startsWith("video/") ? "video" : "image";
        let public_id = `${Date.now()}-${file.originalname.split('.')[0]}`;

        if(req.existingPost){
            if(file.fieldname === "video" && req.existingPost.videoUrl){
                await deleteFromCloudinary(req.existingPost.videoUrl, "video");
            }
            if(file.fieldname === "thumbnail" && req.existingPost.thumbnailUrl){
                await deleteFromCloudinary(req.existingPost.thumbnailUrl, "image");
            }
            if(file.fieldname === "profilePicture" && req.existingPost.profilePicture){
                await deleteFromCloudinary(req.existingPost.profilePicture, "image");
            }
        }

        return {
            folder: "video_streaming_app",
            resource_type: fileType,
            public_id
        };
    },
});

const upload = multer({ storage  });

const uploadFields = upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 }
]);

export { upload, uploadFields, deleteFromCloudinary, cloudinary };