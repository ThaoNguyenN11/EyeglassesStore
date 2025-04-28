import warehouseModel from "../models/warehouseModel.js";
import productModel from "../models/productModel.js";

const addWarehouseEntry = async (req, res) => {
  try {
    const { importID, productID, color, importDate, quantity, importPrice } = req.body;

    const product = await productModel.findOne({ productID });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm không tồn tại!",
      });
    }

    const variation = product.variations.find((v) => v.color === color);
    if (!variation) {
      return res.status(400).json({
        success: false,
        message: `Màu sắc ${color} không có trong sản phẩm!`,
      });
    }

    const existingEntry = await warehouseModel.findOne({ importID });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Mã nhập kho đã tồn tại!",
      });
    }

    const newEntry = new warehouseModel({
      importID,
      productID, 
      color,
      importDate: importDate || Date.now(),
      quantity,
      importPrice,
    });

    variation.quantity += quantity;
    await product.save();
    
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

