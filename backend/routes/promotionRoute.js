import express from 'express';
import {
    addPromotion,
    listPromotions,
    singlePromotion,
    editPromotion,
    removePromotion, 
} from '../controllers/promotionController.js';

const promotionRouter = express.Router();

promotionRouter.post('/add', addPromotion);
promotionRouter.get('/list', listPromotions);
promotionRouter.get('/single/:promotionID', singlePromotion);
promotionRouter.patch('/edit/:promotionID', editPromotion);
promotionRouter.patch('/remove/:promotionID', removePromotion);

export default promotionRouter;
