import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import { v4 as uuidv4 } from 'uuid';

// Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const { userID, shippingAddress, paymentMethod } = req.body;

    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ userID }).populate('items.productID');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Cập nhật giá trị cho các sản phẩm trong giỏ hàng (lấy giá từ productModel)
    cart.items.forEach(item => {
      item.price = item.productID.discountedPrice || item.productID.price; // Lấy giá giảm giá nếu có
    });

    // Tính tổng giá trị đơn hàng
    const totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Tạo mã đơn hàng duy nhất
    const orderID = uuidv4();

    // Tạo đơn hàng mới
    const newOrder = new Order({
      orderID,
      userID,
      items: cart.items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
      isPaid: false,
    });

    await newOrder.save();

    // Sau khi đơn hàng được tạo, xóa giỏ hàng
    await Cart.deleteOne({ userID });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating order', error });
  }
};

// Người mua xem đơn hàng của mình
const getUserOrders = async (req, res) => {
  try {
    // Lấy userID từ request body hoặc query
    const userID = req.body.userID || req.query.userID; // Bạn có thể sử dụng body hoặc query, tùy theo cách client gửi

    if (!userID) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Tìm các đơn hàng của người dùng
    const orders = await Order.find({ userID })
      .populate('items.productID', 'productName price')
      .exec();

    const orderDetails = orders.map(order => {
      const totalOrderPrice = order.items.reduce((total, item) => total + item.quantity * item.price, 0);

      return {
        orderID: order.orderID,
        userName: order.userID, // Lấy userName từ thông tin người dùng (có thể sử dụng populate nếu cần)
        items: order.items.map(item => ({
          product: item.productID,
          quantity: item.quantity,
          color: item.color,
          price: item.price,
          totalPrice: item.quantity * item.price,
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
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};


// Xem tất cả đơn hàng (Admin)
const getAllOrders = async (req, res) => {
  try {
    const userID = req.body.userID || req.query.userID; // Lấy ID người dùng từ token (hoặc req.user.id nếu đã xác thực)

    // Truy vấn tất cả các đơn hàng của người dùng theo userID (kiểu String)
    const orders = await Order.find()
      .populate('items.productID', 'productName price') // Populate thông tin sản phẩm
      .exec();

    // Duyệt qua các đơn hàng và tính tổng giá tiền cho mỗi đơn
    const orderDetails = orders.map(order => {
      const totalOrderPrice = order.items.reduce((total, item) => total + item.quantity * item.price, 0);

      return {
        orderID: order.orderID,
        userName: order.userID, // Lấy userName trực tiếp từ userID
        items: order.items.map(item => ({
          product: item.productID,
          quantity: item.quantity,
          color: item.color,
          price: item.price,
          totalPrice: item.quantity * item.price,
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
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderID, status } = req.body; // Lấy mã đơn hàng và trạng thái mới từ request body

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Tìm đơn hàng theo orderID
    const order = await Order.findOne({ orderID });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Kiểm tra nếu trạng thái đã giống nhau
    if (order.status === status) {
      return res.status(400).json({ success: false, message: 'Order is already in this status' });
    }

    // Cập nhật trạng thái đơn hàng
    order.status = status;

    if (status === 'Cancelled') {
      order.isPaid = false; // Nếu đơn hàng bị hủy, có thể cần hủy thanh toán
      order.paidAt = null;
    }

    await order.save(); // Lưu thay đổi

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// Hủy đơn hàng (người dùng)
const cancelOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    // Kiểm tra đơn hàng có tồn tại không
    const order = await Order.findOne({ orderID });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Kiểm tra trạng thái đơn hàng (Chỉ có thể hủy đơn hàng có trạng thái 'Pending' hoặc 'Processing')
    if (order.status !== 'Pending' && order.status !== 'Processing') {
      return res.status(400).json({ success: false, message: 'Cannot cancel order with current status' });
    }

    // Cập nhật trạng thái đơn hàng thành 'Cancelled'
    order.status = 'Cancelled';
    order.isPaid = false; // Nếu đơn hàng bị hủy, có thể cần hủy thanh toán
    order.paidAt = null;

    await order.save(); // Lưu thay đổi

    res.status(200).json({
      success: true,
      message: 'Order has been cancelled',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error canceling order',
      error: error.message,
    });
  }
};

export { getAllOrders, getUserOrders, createOrder, cancelOrder, updateOrderStatusAdmin };
