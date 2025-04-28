import cron from "node-cron";
import { applyPromotionToActiveProducts } from "./services/productService.js";

cron.schedule("*/5 * * * *", async () => {
  console.log("Đang cập nhật giá khuyến mãi...");
  await applyPromotionToActiveProducts();
});