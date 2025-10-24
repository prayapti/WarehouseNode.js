import mongoose from "mongoose";

const warehouse = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Warehouse name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    GSTIN: {
      type: String,
      required: [true, "GSTIN is required"],
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Shipping", "E-commerce"],
      required: [true, "Warehouse type is required"],
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },
   
  },
  { timestamps: true }
);

const WarehouseModel = mongoose.model("WarehouseModel",warehouse);
export default WarehouseModel;
