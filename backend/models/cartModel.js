import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userID: { type: String, ref: "user", required: true },
    items: [
      {
        productID: { type: String, ref: "Product", required: true}, 
        quantity: { type: Number, required: true, min: 1 },
        color: { type: String, required: true },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default cartModel;
