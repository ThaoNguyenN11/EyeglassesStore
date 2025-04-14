import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Tạo thư mục "avatars" trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
 });

export default upload;