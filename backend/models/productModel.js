import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true, unique: true, trim: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    color: [{ type: String, required: true }], // Lưu danh sách màu sắc
    material: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: {type:Number},
    description: { type: String, required: true },
    bestSeller: { type: Boolean, default: false },
    isActive: {type: Boolean, default: true, },
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
