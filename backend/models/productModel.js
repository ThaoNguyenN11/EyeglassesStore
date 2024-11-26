import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId: { 
            type: String, 
            required: true, 
            unique: true, // Đảm bảo mỗi sản phẩm có một mã duy nhất
            trim: true 
        },
        productName: { 
            type: String, 
            required: true, 
            trim: true 
        },
        category: { 
            type: String, 
            required: true 
        },
        subCategory: { 
            type: String, 
            required: true 
        },
        color: [{ 
            type: String, 
            required: true 
        }], // Lưu danh sách màu sắc
        material: { 
            type: String, 
            required: true 
        },
        salePrice: { 
            type: Number, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        bestSeller: { 
            type: Boolean, 
            default: false 
        }
    },
    { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
