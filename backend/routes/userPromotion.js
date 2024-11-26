import express from 'express';
const router = express.Router();
import Promotion from '../models/promotionModel.js';
import Product from '../models/productModel.js';

// // Get active promotions for the user
// router.get('/active-promotions', async (req, res) => {
//     try {
//         const promotions = await Promotion.find({
//             isActive: true,
//             startDate: { $lte: new Date() },
//             endDate: { $gte: new Date() }
//         });
//         res.json(promotions);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching promotions' });
//     }
// });

// // Apply promotion to a product (calculate discounted price)
// router.get('/apply-promotion/:productId', async (req, res) => {
//     const { productId } = req.params;
//     try {
//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ error: 'Product not found' });

//         const promotion = await Promotion.findOne({
//             applicableProducts: productId,
//             isActive: true,
//             startDate: { $lte: new Date() },
//             endDate: { $gte: new Date() }
//         });

//         let finalPrice = product.price;

//         if (promotion) {
//             if (promotion.discountType === 'percentage') {
//                 finalPrice -= (product.price * promotion.discountValue) / 100;
//             } else if (promotion.discountType === 'fixed') {
//                 finalPrice -= promotion.discountValue;
//             }
//             finalPrice = Math.max(finalPrice, 0); // Ensure price doesn't go below zero
//         }

//         res.json({ productId, originalPrice: product.price, finalPrice });
//     } catch (error) {
//         res.status(500).json({ error: 'Error applying promotion' });
//     }
// });

// export default userPromotion;