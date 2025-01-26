import express from 'express';
import {
    addPromotion,
    listPromotions,
    singlePromotion,
    editPromotion,
    removePromotion, 
} from '../controllers/promotionController.js';

const promotionRouter = express.Router();

// Tạo mới khuyến mãi
promotionRouter.post('/add', addPromotion);

// Lấy danh sách khuyến mãi
promotionRouter.get('/list', listPromotions);

// Lấy thông tin khuyến mãi theo promotionID
promotionRouter.get('/single/:promotionID', singlePromotion);

// Sửa thông tin khuyến mãi theo promotionID
promotionRouter.patch('/edit/:promotionID', editPromotion);

// Xóa khuyến mãi theo promotionID
promotionRouter.patch('/remove/:promotionID', removePromotion);

export default promotionRouter;
