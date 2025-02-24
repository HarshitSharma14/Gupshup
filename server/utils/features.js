import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // Needed for buffer uploads

export const uploadProfileImage = async (req) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "profile-images",
                    resource_type: "image",
                    // transformation: [{ width: 150, height: 150, gravity: "face", crop: "thumb" }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export const uploadAttachment = async (req) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        console.log('yes 1')

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "attachments"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            console.log('yes 2')
            streamifier.createReadStream(req.file.buffer).pipe(stream);
            console.log('yes 3')
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

export const deleteProfileImageByUrl = async (imageUrl) => {
    try {
        console.log(imageUrl)
        const parts = imageUrl.split("/");
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) {
            throw new Error("Invalid Cloudinary URL");
        }

        const folder = parts.slice(uploadIndex + 1, -1).join("/"); // Extract folder path
        const filename = parts.pop().split(".")[0]; // Extract filename without extension

        const publicId = folder ? `${folder}/${filename}` : filename;

        const result = await cloudinary.uploader.destroy(publicId);

        return result;
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw error;
    }
};
