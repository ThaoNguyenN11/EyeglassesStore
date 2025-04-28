import productModel from "../models/productModel.js";
import promotionModel from "../models/promotionModel.js";

export async function applyPromotionToActiveProducts() {
  try {
    const currentDate = new Date();

    const activePromotion = await promotionModel.findOne({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    if (!activePromotion) {
      await productModel.updateMany(
        { isActive: true },
        { $set: { discountedPrice: 0 } }
      );
      console.warn("Không có chương trình khuyến mãi nào đang hoạt động.");
      return;
    }

    // Lấy danh sách sản phẩm active
    const activeProducts = await productModel.find({ isActive: true });

    if (!activeProducts.length) {
      console.warn("Không có sản phẩm nào đang active.");
      return;
    }

    // Cập nhật giá giảm
    for (const product of activeProducts) {
      if (!product.productID) {
        console.error(`Sản phẩm không có productID: ${JSON.stringify(product)}`);
        continue; // Bỏ qua sản phẩm bị lỗi
      }

      const discountedPrice = product.price - (product.price * activePromotion.discountPercentage) / 100;
      product.discountedPrice = discountedPrice;
      await product.save(); // Lưu sản phẩm đã được cập nhật
    }

    console.log("Cập nhật giá khuyến mãi thành công.");
  } catch (error) {
    console.error("Error applying promotion to active products:", error);
  }
}
applyPromotionToActiveProducts() ;