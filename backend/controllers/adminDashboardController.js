import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"



const getAdminDashboardStats = async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);
  
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments({ isActive: true });
  
      const bestSeller = await Product.find({ bestSeller: true }).limit(5);
  
      res.json({
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts,
        bestSeller,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getRecentOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: 'userID',            
          model: 'user',               
          localField: 'userID',        
          foreignField: 'userID',      
          justOne: true,
          select: 'name email'
        });
      res.json({ success: true, data: orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

  const getRevenueByDate = async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getLowStockProducts = async (req, res) => {
    try {
      const products = await Product.find({
        variations: { $elemMatch: { quantity: { $lt: 5 } } },
      });
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getRevenueByWeek = async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: { $week: "$createdAt" },
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  const getRevenueByMonth = async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  const getRevenueByYear = async (req, res) => {
    try {
      const result = await Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: { $year: "$createdAt" },
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
export {getAdminDashboardStats, getLowStockProducts, getRecentOrders, getRevenueByDate, getRevenueByWeek, getRevenueByMonth, getRevenueByYear};