import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    importID: { type: String, required: true, unique: true, trim: true }, 
    productID: { type: mongoose.Schema.Types.String, ref: "product", required: true }, 
    color: { type: String, required: true }, 
    importDate: { type: Date, required: true, default: Date.now },
    quantity: { type: Number, required: true, min: 1 }, 
    importPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const warehouseModel = mongoose.models.warehouse || mongoose.model("warehouse", warehouseSchema);

export default warehouseModel;
