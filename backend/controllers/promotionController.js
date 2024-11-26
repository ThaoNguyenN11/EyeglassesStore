import promotionModel from '../models/promotionModel.js';

// Tạo mới promotion
const addPromotion = async (req, res) => {
    try {
        const { promotionID, name, startDate, endDate, discountPercentage, description } = req.body;

        // Kiểm tra nếu `promotionID` đã tồn tại
        const existingPromotion = await promotionModel.findOne({ promotionID });
        if (existingPromotion) {
            return res.status(400).json({
                success: false,
                message: 'Promotion ID already exists!',
            });
        }

        // Tạo khuyến mãi mới
        const newPromotion = new promotionModel({
            promotionID,
            name,
            startDate,
            endDate,
            discountPercentage,
            description,
        });

        const savedPromotion = await newPromotion.save();
        res.status(201).json({
            success: true,
            message: 'Promotion added successfully!',
            data: savedPromotion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding promotion.',
            error: error.message,
        });
    }
};

// Xem danh sách tất cả promotion
const listPromotions = async (req, res) => {
    try {
        const promotions = await promotionModel.find();
        res.status(200).json({
            success: true,
            data: promotions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching promotions.',
            error: error.message,
        });
    }
};

// Xem thông tin chi tiết promotion theo promotionID
const singlePromotion = async (req, res) => {
    try {
        const { promotionID } = req.params;

        const promotion = await promotionModel.findOne({ promotionID });
        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        res.status(200).json({
            success: true,
            data: promotion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching promotion.',
            error: error.message,
        });
    }
};

// Sửa thông tin promotion theo promotionID
const editPromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;
        const updates = req.body;

        const updatedPromotion = await promotionModel.findOneAndUpdate(
            { promotionID },
            updates,
            { new: true } // Trả về document đã được cập nhật
        );

        if (!updatedPromotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Promotion updated successfully!',
            data: updatedPromotion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating promotion.',
            error: error.message,
        });
    }
};

// Xóa promotion theo promotionID
const removePromotion = async (req, res) => {
    try {
        const { promotionID } = req.params;

        const deletedPromotion = await promotionModel.findOneAndDelete({ promotionID });
        if (!deletedPromotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Promotion removed successfully!',
            data: deletedPromotion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing promotion.',
            error: error.message,
        });
    }
};

export { addPromotion, listPromotions, singlePromotion, editPromotion, removePromotion };
