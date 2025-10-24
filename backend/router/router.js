import express from 'express';
import { registration, verifyOTP, Login, resendOTP } from '../controller/authentication.js';
import { getAnnualReport, createAnnualReport } from '../controller/annualReportController.js';
// import { updateStockByone } from '../controller/productController.js';
import Product from '../model/Product.js';
import orderManagementRouter from "./orderManagement.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import inventoryRoutes from "../routes/inventoryRoutes.js";
import warehouse from "../routes/warehouseRoutes.js";
import userRoutes from '../routes/userRoutes.js';
import roleRoutes from '../routes/roleRoutes.js';
import backupRoutes from '../routes/backupRoutes.js';
const router = express.Router();


router.post('/SignUpview',registration)
router.post("/verify",verifyOTP)
router.post("/Login",Login)
router.post("/resend-otp", resendOTP);

router.get('/annual-reports', getAnnualReport);
router.post('/annual-reports', createAnnualReport);

router.use("/admin/users", userRoutes); 
router.use("/admin/roles", roleRoutes); 

router.use("/order-management", orderManagementRouter);
router.use("/dashboard", dashboardRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/warehouse", warehouse);


router.use('/backup', backupRoutes);


export default router;
