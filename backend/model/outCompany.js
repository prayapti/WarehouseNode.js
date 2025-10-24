import mongoose from "mongoose";

const outboundCompany = new mongoose.Schema({
  CompanyName: {
    type: String,
    required: true,
  },
  CompanyAddress: {
    type: String,
    required: true,
  },
  CompanyPhone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  CompanyEmail: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  CompanyDocuments: {
    type: String, 
    required: true,
  },
  GSTIN:{
    type:String ,
    required :true,
  },
  status:{
    type:String,
    required:true,
    default:false,
  },
 user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },
},{timestamps:true});

const OutboundCompany = mongoose.model("OutboundCompany", outboundCompany);
export default OutboundCompany;
