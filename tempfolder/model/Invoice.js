import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
    },
    invoiceDate: {
        type: Date,
        required: true,
    },
    invoiceAmount: {
        type: Number,
        required: true,
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WarehouseModel",
        required: true,
    },
},{timestamps:true});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
