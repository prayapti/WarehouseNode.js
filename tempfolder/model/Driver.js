import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    DriverName: {
      type: String,
      required: true,
    },
    DriverPhone: {
      type: String,
      required: true,
    },
    DriverLicense: {
      type: String,
      required: true,
    },
    DocumentsDriver: {
      type: String,
      required: false,
    },
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
  },
  { timestamps: true }
);


const TransporterSchema = new mongoose.Schema({
    transporterName:{
        type:String,
        required:true
    },
    transporterPhone:{
        type:String,
        required:true,
    },
    transporterEmail:{
        type:String,
        required:true,
    },
    transporterDocuments:{
        type:String,
        required:false
    },
   user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },
},{timestamps:true})



const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;
