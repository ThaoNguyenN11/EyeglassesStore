import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantityInCart } from "../controllers/cartController.js";

const cartRoute = express.Router();

// Route để thêm sản phẩm vào giỏ hàng
cartRoute.post("/add", addToCart);

// Route để lấy thông tin giỏ hàng của người dùng
cartRoute.get("/:userID", getCart);

//update soos luong san pham trong gio hang
cartRoute.patch("/update", updateQuantityInCart);

//update soos luong san pham trong gio hang
cartRoute.delete("/remove", removeFromCart);
export default cartRoute;
