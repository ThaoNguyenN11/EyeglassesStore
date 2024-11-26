import express from 'express';
import {addProduct, listProducts, removeProduct, singleProduct, editProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js';

const productRouter = express.Router();

productRouter.post('/add', upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'image3', maxCount:1}, {name:'image4', maxCount:1}]), addProduct);
productRouter.delete('/remove/:productId', removeProduct);
productRouter.get('/single/:productId', singleProduct);
productRouter.get('/list', listProducts);
productRouter.patch('/edit/:productId', editProduct);

export default productRouter
