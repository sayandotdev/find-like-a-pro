import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (filePath: string, resourceType: "image" | "raw" | "video" | "auto" = "auto") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "rag-by-own",
            resource_type: resourceType,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};
