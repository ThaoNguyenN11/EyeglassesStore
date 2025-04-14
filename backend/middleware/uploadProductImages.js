import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Danh sách màu được hỗ trợ
const colors = ["Red", "Blue", "Green", "Black", "White", "Orange", "Pink", "Purple", "Clear"];

// Cấu hình Cloudinary cho ảnh sản phẩm
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const colorKey = Object.keys(req.files).find((key) => req.files[key].some((f) => f.originalname === file.originalname));
    const color = colors.find((c) => colorKey && colorKey.includes(`files_${c}`));

    return {
      folder: "products", // Thư mục lưu ảnh sản phẩm trên Cloudinary
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `product-${Date.now()}-${color || "default"}-${file.originalname}`,
    };
  },
});

// Middleware Multer (cho phép nhiều ảnh theo từng màu)
const uploadProductImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
}).fields(colors.map((color) => ({ name: `files_${color}`, maxCount: 5 }))); // Mỗi màu có tối đa 5 ảnh

export default uploadProductImages;
