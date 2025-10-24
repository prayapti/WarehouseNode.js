// router/orderManagement.js
import express from "express";
import companyRoutes from "../routes/companyRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";

const router = express.Router();

// Mount routes
router.use("/companies", companyRoutes);
router.use("/orders", orderRoutes);

// API info
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order Management API",
    version: "1.0.0",
    endpoints: {
      companies: "/api/companies",
      orders: "/api/orders"
    }
  });
});

export default router;
