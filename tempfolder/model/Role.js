import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
  userCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
