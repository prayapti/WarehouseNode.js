import express from "express";
import Order from "../model/Order.js";
import Product from "../model/Product.js";

const router = express.Router();

// 1️⃣ Summary API
router.get("/summary", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalStockAgg = await Product.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stock" } } }]);
    const totalStock = totalStockAgg[0]?.totalStock || 0;

    // Analytics example (completed orders %)
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const analytics = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

    res.json({ totalOrders, stock: totalStock, analytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
});

// 2️⃣ Status API
router.get("/status", async (req, res) => {
  try {
    const statuses = ["completed", "processing", "pending", "cancelled"];
    const result = {};

    for (const status of statuses) {
      result[status] = await Order.countDocuments({ status });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching status", error: error.message });
  }
});

// 3️⃣ Recent Orders API
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("company", "name")
      .populate("products.productId", "name price");

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recent orders", error: error.message });
  }
});

export default router;
