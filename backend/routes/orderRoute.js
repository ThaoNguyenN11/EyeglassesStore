import express from 'express';
import { getAllOrders, getUserOrders, createOrder, cancelOrder, updateOrderStatusAdmin } from '../controllers/orderController.js';

const orderRoute =  express.Router();

// Route để người dùng xem các đơn hàng của mình
orderRoute.get('/user/get', getUserOrders); // Chỉ người dùng đã đăng nhập mới được xem

// Route để admin xem tất cả các đơn hàng
orderRoute.get('/admin/get', getAllOrders); // Chỉ admin mới được phép truy cập

// Route để tạo đơn hàng mới
orderRoute.post('/user/create', createOrder); // Người dùng có thể tạo đơn hàng

// Route để admin cập nhật trạng thái đơn hàng
orderRoute.patch('/admin/update', updateOrderStatusAdmin); // Chỉ admin mới có quyền cập nhật trạng thái

// Route để người dùng hủy đơn hàng chưa hoàn thành
orderRoute.patch('/user/:orderID/cancel', cancelOrder); // Người dùng có thể hủy đơn hàng chưa hoàn thành

export default orderRoute;
