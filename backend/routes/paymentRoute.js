import express from 'express';
import createMoMoPayment from '../controllers/paymentController.js';

const paymentRoute = express.Router();
paymentRoute.post('/momo', createMoMoPayment);

export default paymentRoute;
