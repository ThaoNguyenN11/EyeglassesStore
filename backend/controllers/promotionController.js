import promotionModel from '../models/promotionModel.js';
import productModel from "../models/productModel.js";
import { applyPromotionToActiveProducts } from "../services/promotionService.js";

const updateDiscountedPrices = async (req, res) => {
  try {
    await applyPromotionToActiveProducts();
    res.status(200).json({
      success: true,
      message: "Discounted prices updated successfully for active products.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update discounted prices.",
      error: error.message,
    });
  }
};


// Tạo mới promotion
const addPromotion = async (req, res) => {
    try {
        const { promotionID, name, startDate, endDate, discountPercentage, description, isActive } = req.body;

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
            isActive,
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
        const promotions = await promotionModel.find({ isActive: true });
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

//xem tung chuong trinh
const singlePromotion = async (req, res) => {
    try {
        const { promotionID } = req.params; // Get promotionID from URL params

        // Find the promotion in the database
        const promotion = await promotionModel.findOne({ promotionID });

        // If no promotion found, return 404
        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        // Return the promotion data if found
        res.status(200).json({
            success: true,
            data: promotion,
        });
    } catch (error) {
        // Handle any errors
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
        const { promotionID } = req.params;  // Get promotionId from URL params
        const updates = req.body;  // Get updated data from request body

        // Find the promotion and update it
        const updatedPromotion = await promotionModel.findOneAndUpdate(
            { promotionID: promotionID },  // Match the promotionID field in the database
            updates,
            { new: true, runValidators: true } // new: return the updated doc, runValidators: validate schema
        );

        // If promotion not found
        if (!updatedPromotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        // Return success response with the updated data
        res.status(200).json({
            success: true,
            message: 'Promotion updated successfully!',
            data: updatedPromotion,
        });
    } catch (error) {
        // Handle error
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

        // Find the promotion by promotionID and update isActive to false
        const updatedPromotion = await promotionModel.findOneAndUpdate(
            { promotionID },
            { isActive: false, updatedAt: Date.now() }, // Set isActive to false and update timestamp
            { new: true } // Return the updated document
        );

        // If no promotion is found, return 404
        if (!updatedPromotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found!',
            });
        }

        // Return success with the updated promotion
        res.status(200).json({
            success: true,
            message: 'Promotion hidden successfully!',
            data: updatedPromotion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error hiding promotion.',
            error: error.message,
        });
    }
};
  
export { addPromotion, listPromotions, singlePromotion, editPromotion, removePromotion, updateDiscountedPrices};
