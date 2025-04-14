import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  editProduct,
  getActiveProducts,
  getInactiveProducts,
  updateProductDiscount,
  searchProducts,
} from "../controllers/productController.js";
import uploadProductImages from "../middleware/uploadProductImages.js";

const productRouter = express.Router();

productRouter.post("/add", uploadProductImages, addProduct);
productRouter.patch("/remove/:productID", removeProduct);
productRouter.get("/single/:productID", singleProduct);
productRouter.get("/list", listProducts);
productRouter.patch("/edit/:productID", uploadProductImages, editProduct);
productRouter.get("/activeProduct", getActiveProducts);
productRouter.get("/inactiveproduct", getInactiveProducts);
productRouter.patch("/discount/:productID", updateProductDiscount);
productRouter.get("/search", searchProducts);

export default productRouter;
