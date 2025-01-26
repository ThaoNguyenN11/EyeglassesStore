import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connect } from 'mongoose';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import adminPromotion from './routes/promotionRoute.js';
import productRouter from './routes/productRoute.js';
import promotionRouter from './routes/promotionRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/promotion', promotionRouter);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
// app.use('/api/user_promotion', userPromotion);

app.get('/',(req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT: ' + port))