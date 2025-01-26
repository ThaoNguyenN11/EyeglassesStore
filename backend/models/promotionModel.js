import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
    {
        promotionID: { type: String, required: true, unique: true }, // Mã khuyến mãi duy nhất
        name: { type: String, required: true }, // Tên khuyến mãi
        startDate: { type: Date, required: true, unique: true }, // Ngày bắt đầu
        endDate: { type: Date, required: true, unique: true }, // Ngày kết thúc
        discountPercentage: { type: Number, required: true, min: 0, max: 100 }, // Phần trăm giảm giá cho sản phẩm
        description: { type: String }, // Mô tả
        isActive: { type: Boolean, default: true }, 
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model từ schema
const promotionModel = mongoose.models.promotion || mongoose.model('promotion', promotionSchema);

export default promotionModel;
