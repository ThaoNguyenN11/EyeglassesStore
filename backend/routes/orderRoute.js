import express from 'express';
import { getAllOrders, getUserOrders, createOrder, cancelOrder, updateOrderStatusAdmin, getAllUserOrders } from '../controllers/orderController.js';

const orderRouter =  express.Router();

orderRouter.get('/user/get', getUserOrders); // Chỉ người dùng đã đăng nhập mới được xem
orderRouter.get('/admin/get', getAllOrders); // Chỉ admin mới được phép truy cập
orderRouter.post('/user/create', createOrder); // Người dùng có thể tạo đơn hàng
orderRouter.patch('/admin/update', updateOrderStatusAdmin); // Chỉ admin mới có quyền cập nhật trạng thái
orderRouter.patch('/user/:orderID/cancel', cancelOrder); // Người dùng có thể hủy đơn hàng chưa hoàn thành
orderRouter.get('admin/getUserOrders/:userID', getAllUserOrders); //Admin xem danh sach don hang cua nguoi dung

export default orderRouter;
