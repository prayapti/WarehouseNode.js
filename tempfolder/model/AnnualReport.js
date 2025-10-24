import mongoose from "mongoose";

const annualReportSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true }, 
  revenue: { type: Number, required: true },
  orders: { type: Number, required: true },
  itemsShipped: { type: Number, required: true },
  growthRate: { type: Number, required: true },
   warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "WarehouseModel", required: true },
});

const AnnualReport = mongoose.model("AnnualReport", annualReportSchema);

export default AnnualReport;
