import express from "express";
import { addWarehouseEntry, getAllWarehouseEntries } from "../controllers/warehouseController.js";

const warehouseRouter = express.Router();

warehouseRouter.post('/add', addWarehouseEntry);
warehouseRouter.get('/list', getAllWarehouseEntries);

export default warehouseRouter;