import warehouseModel from "../models/warehouseModel.js";
import productModel from "../models/productModel.js";

const addWarehouseEntry = async (req, res) => {
  try {
    const { importID, productID, color, importDate, quantity, importPrice } = req.body;

    // 🔹 Tìm sản phẩm bằng productID thay vì ObjectId
    const product = await productModel.findOne({ productID });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm không tồn tại!",
      });
    }

    // 🔹 Kiểm tra sản phẩm có biến thể màu sắc không
    const variation = product.variations.find((v) => v.color === color);
    if (!variation) {
      return res.status(400).json({
        success: false,
        message: `Màu sắc ${color} không có trong sản phẩm!`,
      });
    }

    // 🔹 Kiểm tra nếu importID đã tồn tại
    const existingEntry = await warehouseModel.findOne({ importID });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Mã nhập kho đã tồn tại!",
      });
    }

    // 🔹 Tạo bản ghi nhập kho mới
    const newEntry = new warehouseModel({
      importID,
      productID, // Vẫn dùng productID, không đổi sang ObjectId
      color,
      importDate: importDate || Date.now(),
      quantity,
      importPrice,
    });

    // 🔹 Cập nhật số lượng tồn kho cho sản phẩm
    variation.quantity += quantity;
    await product.save();
    
    // 🔹 Lưu vào database
    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Nhập kho thành công!",
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi nhập kho!",
      error: error.message,
    });
  }
};

// Lấy danh sách các lần nhập kho
const getAllWarehouseEntries = async (req, res) => {
  try {
    const warehouseEntries = await warehouseModel.find();

    res.status(200).json({
      success: true,
      data: warehouseEntries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu nhập kho!",
    });
  }
};

export { addWarehouseEntry, getAllWarehouseEntries };

