import express from 'express';
import {addProduct, listProducts, removeProduct, singleProduct, editProduct, getActiveProducts, getInactiveProducts, updateProductDiscount} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',addProduct);
productRouter.patch('/remove/:productID', removeProduct);
productRouter.get('/single/:productID', singleProduct);
productRouter.get('/list', listProducts);
productRouter.patch('/edit/:productID', editProduct);
productRouter.get('/activeProduct', getActiveProducts);
productRouter.get('/inactiveproduct', getInactiveProducts);
productRouter.patch("/discount/:productID", updateProductDiscount);


export default productRouter
