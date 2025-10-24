import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: () => "P" + Date.now().toString().slice(-6),
  },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  minStock: { type: Number, required: true, min: 0 },
  maxStock: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  supplier: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["in-stock", "low-stock", "out-of-stock"], default: "in-stock" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastUpdated: { type: String }, // YYYY-MM-DD
user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },});

// Update `updatedAt` and `status` before save
inventorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.lastUpdated = new Date().toISOString().split("T")[0];

  if (this.stock > this.minStock) this.status = "in-stock";
  else if (this.stock > 0) this.status = "low-stock";
  else this.status = "out-of-stock";

  next();
});

// Virtual for frontend id
inventorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

inventorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { delete ret._id; }
});

export default mongoose.model("InventoryProducts", inventorySchema);
