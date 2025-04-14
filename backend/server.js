import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connect } from "mongoose";
import connectDB from "./config/mongodb.js";
import cloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminPromotion from "./routes/promotionRoute.js";
import productRouter from "./routes/productRoute.js";
import promotionRouter from "./routes/promotionRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import warehouseRouter from "./routes/warehouseRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoute from './routes/paymentRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//api endpoints
app.use("/api/payment", paymentRoute);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/warehouse", warehouseRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT: " + port));
