import express from "express";
import { getAdminDashboardStats, getLowStockProducts, getRecentOrders, getRevenueByDate, getRevenueByWeek, getRevenueByMonth, getRevenueByYear } from "../controllers/adminDashboardController.js";

const adminRouter = express.Router();

adminRouter.get('/stats', getAdminDashboardStats);
adminRouter.get('/recent-orders', getRecentOrders);
adminRouter.get('/revenue-by-date', getRevenueByDate);
adminRouter.get('/low-stock', getLowStockProducts);
adminRouter.get('/revenue-by-week', getRevenueByWeek);
adminRouter.get('/revenue-by-month', getRevenueByMonth);
adminRouter.get('/revenue-by-year', getRevenueByYear);

export default adminRouter;
