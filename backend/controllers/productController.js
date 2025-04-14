import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";

const addProduct = async (req, res) => {
  try {
    const {
      productID,
      productName,
      category,
      material,
      price,
      description,
      bestSeller,
      discountedPrice = 0,
      isActive = true,
      variations,
      dimensions,
    } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: "Please upload at least one image!" });
    }

    // Chuyển đổi variations từ string sang object nếu cần
    let parsedVariations = typeof variations === "string" ? JSON.parse(variations) : variations;

    // Gán ảnh theo từng màu
    const processedVariations = parsedVariations.map((variation) => {
      const color = variation.color;
      const colorKey = `files_${color}`; // Ví dụ: files_Red, files_Blue

      return {
        ...variation,
        imageUrls: req.files[colorKey] ? req.files[colorKey].map(file => file.path) : []
      };
    });

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productID,
      productName,
      category,
      material,
      price,
      discountedPrice,
      description,
      bestSeller,
      isActive,
      variations: processedVariations,
      dimensions,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Added successfully!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the product.",
      error: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    let updates = req.body;

    // Kiểm tra sản phẩm có tồn tại hay không
    const existingProduct = await productModel.findOne({ productID });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    // Kiểm tra và parse variations từ JSON string nếu cần
    let updatedVariations = typeof updates.variations === "string" ? JSON.parse(updates.variations) : updates.variations;

    // Nếu có ảnh mới, ghi đè ảnh theo từng màu
    if (req.files && Object.keys(req.files).length > 0) {
      updatedVariations = updatedVariations.map((variation) => {
        const colorKey = `files_${variation.color}`;

        return {
          ...variation,
          imageUrls: req.files[colorKey] ? req.files[colorKey].map(file => file.path) : variation.imageUrls // Ghi đè ảnh
        };
      });
    }

    // Cập nhật dữ liệu sản phẩm
    const updatedProduct = await productModel.findOneAndUpdate(
      { productID },
      {
        $set: {
          ...updates,
          variations: updatedVariations
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
      error: error.message,
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error listing products", error: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const product = await productModel.findOne({ productID });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching the product." });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productID = req.params.productID;
    const product = await productModel.findOneAndUpdate(
      { productID },
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.status(200).json({ success: true, message: "Product hidden successfully!", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while hiding the product." });
  }
};

const getActiveProducts = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: true });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching products." });
  }
};

const getInactiveProducts = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: false });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching products." });
  }
};

const updateProductDiscount = async (req, res) => {
  try {
    const { productID } = req.params;
    const { discountedPrice } = req.body;

    if (discountedPrice < 0) {
      return res.status(400).json({ success: false, message: "Giá giảm không hợp lệ!" });
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { productID },
      { discountedPrice },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm!" });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật giảm giá thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật giảm giá sản phẩm.", error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Lấy từ khóa tìm kiếm từ URL

    if (!query) {
      return res.status(400).json({ success: false, message: "Missing search query!" });
    }

    const products = await productModel.find({
      $or: [
        { productName: { $regex: query, $options: "i" } }, // Tìm trong tên sản phẩm (không phân biệt hoa thường)
        { category: { $regex: query, $options: "i" } }, // Tìm trong danh mục
        { material: { $regex: query, $options: "i" } }, // Tìm trong chất liệu
        { description: { $regex: query, $options: "i" } }, // Tìm trong mô tả
      ],
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error searching products!" });
  }
};

export {
  addProduct,
  editProduct,
  listProducts,
  singleProduct,
  removeProduct,
  getActiveProducts,
  getInactiveProducts,
  updateProductDiscount,
  searchProducts,
};
