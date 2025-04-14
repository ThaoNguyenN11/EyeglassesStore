import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantityInCart } from "../controllers/cartController.js";
import { getAllUserOrders } from "../controllers/orderController.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/:userID", getCart);
cartRouter.patch("/update", updateQuantityInCart);
cartRouter.delete("/remove", removeFromCart);

export default cartRouter;
