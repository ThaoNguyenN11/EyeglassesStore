import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderID: { type: String, required: true, unique: true }, // Mã đơn hàng
        userID: { type: String, ref: 'user', required: true }, // Liên kết tới User
        items: [
            {
                productID: { type: String, ref: 'product', required: true }, // Liên kết tới sản phẩm
                quantity: { type: Number, required: true, min: 1 }, // Số lượng sản phẩm
                price: { type: Number, required: true }, // Giá sản phẩm
                color: { type: String, required: true }, // Màu kính
            },
        ],
        totalPrice: { type: Number, required: true }, // Tổng giá trị đơn hàng
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // Các trạng thái đơn hàng
            default: 'Pending',
        },
        paymentMethod: { type: String, required: true }, // Phương thức thanh toán (VD: 'COD', 'Online')
        isPaid: { type: Boolean, default: false }, // Trạng thái thanh toán
        paidAt: { type: Date }, // Ngày thanh toán (nếu có)
    },
    { timestamps: true } // Thêm createdAt và updatedAt
);

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
