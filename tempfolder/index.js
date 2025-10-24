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

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api",router)
app.use("/orderManagement", orderManagementRouter);
app.use("/order-management", orderRoutes);


const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
