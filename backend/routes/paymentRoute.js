import express from 'express';
import { createMoMoPayment, notifyPayment } from '../controllers/paymentController.js';

const paymentRoute = express.Router();
paymentRoute.post('/momo', createMoMoPayment);
paymentRoute.post('/momo/notify', notifyPayment);

export default paymentRoute;
