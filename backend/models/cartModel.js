import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        userID: { type: String, ref: 'user', required: true }, // Liên kết tới User
        items: [
            {
                productID: { type: String, ref: 'product', required: true }, // Liên kết tới sản phẩm
                quantity: { type: Number, required: true, min: 1 }, // Số lượng sản phẩm
                price: { type: Number, required: true }, // Giá tại thời điểm thêm vào giỏ
                color: { type: String, required: true }, // Màu kính
            },
        ],
        updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật
    },
    { timestamps: true } // Thêm createdAt và updatedAt
);

const cartModel = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default cartModel;
