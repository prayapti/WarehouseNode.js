import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import Order from "../model/Order.js"; 
import { cloudinary } from "../Utilities&MiddleWare/cloudinary.js";
import { AddWarehouse } from "../controller/warehouseController.js";
import { body } from "express-validator";
import { authenticateToken } from "../Utilities&MiddleWare/jwt.js";
import express from "express"
const router = express.Router()

router.post("/add", authenticateToken,AddWarehouse);

export default router;