import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouseModel",
        required: true,
    },
    
},{timestamps:true}
);

const Product = mongoose.model("Product", productSchema);
export default Product;