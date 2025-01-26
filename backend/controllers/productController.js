import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      productID,
      productName,
      category,
      subCategory,
      color,
      material,
      price,
      description,
      bestSeller,
      discountedPrice = 0,
      isActive = true, // Nếu không có giá trị isActive trong req.body, mặc định là true
    } = req.body;

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      productID,
      productName,
      category,
      subCategory,
      color,
      material,
      price,
      description,
      bestSeller,
      discountedPrice,
      isActive, // Chuyển giá trị isActive vào đây
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Xóa mềm các sản phẩm bằng cách thay đổi trạng thái
const removeProduct = async (req, res) => {
  try {
    const productID = req.params.productID; // Lấy productId từ URL
    const product = await productModel.findOneAndUpdate(
      { productID },
      { isActive: false, updatedAt: Date.now() }, // Đánh dấu sản phẩm là không hoạt động
      { new: true } // Trả về sản phẩm sau khi cập nhật
    );

    if (!product) {
      // Kiểm tra xem sản phẩm có được tìm thấy hay không
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product hidden successfully!",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while hiding the product.",
    });
  }
};

// List all products
const listProducts = async (req, res) => {
  try {
    const currentDate = new Date();
    // Lấy tất cả các sản phẩm
    const products = await productModel.find(); //chỉ hiển thị nhưngx sản phẩm còn hoạt động

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error listing products",
      error: error.message,
    });
  }
};

// Get single product information by ID
const singleProduct = async (req, res) => {
  try {
    const productID = req.params.productID; // Lấy productID từ URL
    const product = await productModel.findOne({ productID }); // Tìm sản phẩm theo productID

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product.",
    });
  }
};

// Chỉnh sửa thông tin sản phẩm
const editProduct = async (req, res) => {
  try {
    const { productID } = req.params; // Lấy productId từ URL (không cần lấy từ req.params.productId)
    const updates = req.body; // Lấy thông tin cập nhật từ body

    // Tìm và cập nhật sản phẩm theo productId
    const updatedProduct = await productModel.findOneAndUpdate(
      { productID }, // Tìm sản phẩm theo productId
      updates, // Cập nhật thông tin
      { new: true, runValidators: true } // `new` để trả về document sau khi cập nhật, `runValidators` để kiểm tra validation
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
    });
  }
};

//lay tat ca san pham dang co trang thai la ban
const getActiveProducts =  async (req, res) => {
  try {
    const products = await productModel.find({ isActive: true }); // Lọc chỉ sản phẩm hoạt động
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

// Get all unactive products
const getInactiveProducts = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: false }); // Lọc chỉ sản phẩm hoạt động
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

const updateProductDiscount = async (req, res) => {
  try {
    const { productID } = req.params;

    // Lấy thông tin sản phẩm
    const product = await productModel.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Lấy tất cả các chương trình khuyến mãi còn hiệu lực
    const currentDate = new Date();
    const promotions = await promotionModel.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      isActive: true,
    });

    // Lấy chi tiết chương trình khuyến mãi cho sản phẩm
    const promotionDetails = await promotionDetailModel.find({
      productID: product._id,
      promotionID: { $in: promotions.map((promo) => promo._id) },
    });

    // Tính toán giá giảm cho sản phẩm
    await product.calculateDiscountedPrice(promotionDetails);

    res.status(200).json({ message: "Product price updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addProduct,
  removeProduct,
  listProducts,
  singleProduct,
  editProduct,
  getActiveProducts,
  getInactiveProducts,
  updateProductDiscount,
};
