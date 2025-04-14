import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    importID: { type: String, required: true, unique: true, trim: true }, // Mã nhập kho
    productID: { type: mongoose.Schema.Types.String, ref: "product", required: true }, // Liên kết đến sản phẩm
    color: { type: String, required: true }, // Màu sắc cụ thể của sản phẩm
    importDate: { type: Date, required: true, default: Date.now }, // Ngày nhập kho
    quantity: { type: Number, required: true, min: 1 }, // Số lượng nhập
    importPrice: { type: Number, required: true, min: 0 }, // Giá nhập của sản phẩm
  },
  { timestamps: true }
);

const warehouseModel = mongoose.models.warehouse || mongoose.model("warehouse", warehouseSchema);

export default warehouseModel;
