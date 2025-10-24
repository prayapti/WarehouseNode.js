// model/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return "P" + Date.now().toString().slice(-6);
    }
  },
  location:{
    type: String,
    required: [true, "location is required"],
    trim: true
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "inactive", "discontinued","in-stock","out-of-stock","low-stock"],
    default: "active"
  },
  supplier:{
    type:String,
    required:true

  },
  maxStock:{
    type: Number,
    required: true,
    trim: true
  },
  minStock:{
    type: Number,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Product", productSchema);
