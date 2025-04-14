import mongoose from "mongoose";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/**
 * Thêm sản phẩm vào giỏ hàng
 */
const addToCart = async (req, res) => {
  try {
    const { userID, productID, quantity, color } = req.body;

    if (!userID || !productID || !quantity || !color) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userID, productID, quantity, or color",
      });
    }

    let cart = await Cart.findOne({ userID });
    if (!cart) {
      cart = new Cart({ userID, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productID === productID && item.color === color
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productID, quantity, color });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message || "Unknown error",
    });
  }
};

/**
 * Lấy giỏ hàng của người dùng
 */
const getCart = async (req, res) => {
  try {
    const { userID } = req.params;

    const cart = await Cart.aggregate([
      { $match: { userID } }, // Lọc giỏ hàng theo userID
      { $unwind: "$items" }, // Tách mảng items thành từng phần tử riêng
      { 
        $lookup: {
          from: "products", // Bảng Product trong MongoDB
          localField: "items.productID",
          foreignField: "productID",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }, // Bỏ mảng bọc ngoài kết quả của lookup

      {
        $addFields: {
          "productDetails.selectedVariation": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$productDetails.variations", // Danh sách biến thể
                  as: "variation",
                  cond: { 
                    $eq: [
                      { $toString: "$$variation.color" }, 
                      { $toString: "$items.color" } 
                    ] 
                  }
                }
              },
              0
            ]
          }
        }
      },

      { 
        $group: {
          _id: "$_id",
          userID: { $first: "$userID" },
          items: { 
            $push: { 
              productID: "$items.productID",
              quantity: "$items.quantity",
              color: "$items.color", 
              productDetails: {
                productID: "$productDetails.productID",
                productName: "$productDetails.productName",
                price: "$productDetails.price",
                discountedPrice: "$productDetails.discountedPrice",
                selectedVariation: {
                  $ifNull: ["$productDetails.selectedVariation", null] 
                }
              }
            }
          },
        }
      }
    ]);

    if (!cart || cart.length === 0) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart: cart[0] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Error fetching cart", error });
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
const updateQuantityInCart = async (req, res) => {
  try {
    const { userID, productID, color, quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than zero" });
    }

    let cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productID === productID && item.color === color
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Error updating cart", error });
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
const removeFromCart = async (req, res) => {
  try {
    const { userID, productID, color } = req.body;
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productID === productID && item.color === color)
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Error removing item from cart", error });
  }
};

export { addToCart, getCart, updateQuantityInCart, removeFromCart };
