import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
import router from "./router/router.js";
import orderManagementRouter from "./router/orderManagement.js";
import orderRoutes from "./routes/orderRoutes.js"; 

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // front-end URL
  credentials: true
}));
app.use(express.json());

// Test route for root
app.get("/", (req, res) => {
  res.send("✅ Warehouse Backend is running successfully!");
});

// API Routes
app.use("/api", router);
app.use("/orderManagement", orderManagementRouter);
app.use("/order-management", orderRoutes);

// Start server
const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
