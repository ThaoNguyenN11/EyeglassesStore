import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { v4 as uuidv4 } from "uuid";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const { userID, shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ userID }); 

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const productIDs = cart.items.map(item => item.productID);
    const products = await Product.find({ productID: { $in: productIDs } });
    const productMap = {};
    products.forEach(product => {
      productMap[product.productID] = product;
    });
    cart.items.forEach(item => {
      const product = productMap[item.productID];
      item.price = product?.discountedPrice || product?.price ;
    });

    const updatedItems = cart.items.map(item => {
      const product = productMap[item.productID];
      return {
        productID: item.productID,
        quantity: item.quantity,
        color: item.color,
        price: product?.discountedPrice || product?.price
      };
    });
    const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10;
    const newOrder = new Order({
      orderID: uuidv4(),
      userID,
      items: updatedItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: "Pending",
      isPaid: false,
    });

    await newOrder.save();

    await Cart.deleteOne({ userID });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error creating order", error });
  }

  console.log(" Received order payload:", req.body);
};

// Người mua xem đơn hàng của mình
const getUserOrders = async (req, res) => {
  try {
    const userID = req.body.userID || req.query.userID; 

    if (!userID) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Tìm các đơn hàng của người dùng
    const orders = await Order.find({ userID })
      .populate({
        path: "items.productID",
        model: "Product",
        select: "productName",
        localField: "items.productID",
        foreignField: "productID",
        justOne: true, 
      })      
      .exec();

    const orderDetails = orders.map((order) => {
      const totalOrderPrice = order.items.reduce(
        (total, item) => total + item.quantity * item.price + 10,
        0
      );

      return {
        orderID: order.orderID,
        userName: order.userID, 
        items: order.items.map((item) => ({
          product: item.productID,
          quantity: item.quantity,
          color: item.color,
          price: item.price,
          totalPrice: item.quantity * item.price + 10,
        })),
        totalPrice: totalOrderPrice,
        shippingAddress: order.shippingAddress,
        status: order.status,
      };
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Xem tất cả đơn hàng (Admin)
const getAllOrders = async (req, res) => {
  try {
    const userID = req.body.userID || req.query.userID;
    // Truy vấn tất cả các đơn hàng của người dùng theo userID (kiểu String)
    const orders = await Order.find()
      .populate({
        path: "items.productID",
        model: "Product",
        select: "productName",
        localField: "items.productID",
        foreignField: "productID",
        justOne: true, 
      }) 
      .exec();

    // Duyệt qua các đơn hàng và tính tổng giá tiền cho mỗi đơn
    const orderDetails = orders.map((order) => {
      return {
        orderID: order.orderID,
        userName: order.userID, 
        items: order.items.map((item) => ({
          product: item.productID,
          quantity: item.quantity,
          color: item.color,
          price: item.price,
        })),
        totalPrice:  order.totalPrice,
        shippingAddress: order.shippingAddress,
        status: order.status,
      };
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderID, status } = req.body; // Lấy mã đơn hàng và trạng thái mới từ request body

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Tìm đơn hàng theo orderID
    const order = await Order.findOne({ orderID });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === status) {
      return res
        .status(400)
        .json({ success: false, message: "Order is already in this status" });
    }

    order.status = status;

    if (status === "Cancelled") {
      order.isPaid = false; 
      order.paidAt = null;
    }

    await order.save(); 

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Hủy đơn hàng (người dùng)
const cancelOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const order = await Order.findOne({ orderID });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.status !== "Pending" && order.status !== "Processing") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel order with current status",
        });
    }

    order.status = "Cancelled";
    order.isPaid = false; 
    order.paidAt = null;

    await order.save(); // Lưu thay đổi

    res.status(200).json({
      success: true,
      message: "Order has been cancelled",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error canceling order",
      error: error.message,
    });
  }
};

//Admin hủy đơn hàng
const cancelOrderAdmin = async (req, res) => {
  try {
    const { orderID } = req.body;

    const order = await Order.findOne({ orderID });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order is already cancelled" });
    }

    order.status = "Cancelled";
    order.isPaid = false;
    order.paidAt = null;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

//Admin xem tất cả đơn hàng của 1 người dùng
const getAllUserOrders = async (req, res) => {
  try {
    const { userID } = req.query;

    let query = {};
    if (userID) {
      query.userID = userID; 
    }

    const orders = await Order.find(query)
      .populate("userID", "name email")
      .populate({
        path: "items.productID",
        model: "Product",
        select: "productName",
        localField: "items.productID",
        foreignField: "productID",
        justOne: true, 
      })
      .exec();

    const orderDetails = orders.map((order) => ({
      orderID: order._id,
      user: {
        id: order.userID._id,
        name: order.userID.name,
        email: order.userID.email,
      },
      items: order.items.map((item) => ({
        product: item.productID.productName,
        quantity: item.quantity,
        color: item.color,
        price: item.price,
        totalPrice: item.quantity * item.price,
      })),
      totalPrice: order.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
      shippingAddress: order.shippingAddress,
      status: order.status,
    }));

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export {
  getAllOrders,
  getUserOrders,
  createOrder,
  cancelOrder,
  updateOrderStatusAdmin,
  getAllUserOrders,
  cancelOrderAdmin,
};
