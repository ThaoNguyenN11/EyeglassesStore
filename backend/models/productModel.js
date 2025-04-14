import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productID: { type: String, unique: true, required: true, trim: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    description: { type: String, required: true },
    bestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    variations: [
      {
        color: { type: String, required: true, default: 'no-color' },
        imageUrls: [{ type: String, required: true }],
        quantity: { type: Number, min: 0, default: 0 },
        soldQuantity: { type: Number, min: 0, default: 0 },
      },
    ],

    dimensions: {
      width: { type: Number },
      lensWidth: { type: Number },
      lensHeight: { type: Number },
      bridge: { type: Number },
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (this.productID) return next(); // Nếu đã có productID, bỏ qua

  const categoryPrefix = {
    glassesframe: "F",
    sunglasses: "S",
    lens: "L",
    accessories: "A",
  };

  const prefix = categoryPrefix[this.category.toLowerCase()];
  if (!prefix) return next(new Error("Invalid category"));

  const lastProduct = await this.constructor
    .findOne({ category: this.category })
    .sort({ createdAt: -1 });
  let number = "000"; // Mặc định số thứ tự đầu tiên
  if (lastProduct && lastProduct.productID) {
    const lastNumber = parseInt(lastProduct.productID.slice(2), 10);
    number = String(lastNumber + 1).padStart(3, "0"); // Tăng số thứ tự và giữ format 000
  }

  this.productID = `P${prefix}${number}`;
  next();
});

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
