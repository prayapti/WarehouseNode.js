import mongoose from "mongoose";

const InboundCompany = new mongoose.Schema({
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
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },
},{timestamps:true})

const Inbound = mongoose.model("Inbound",InboundCompany)
export default Inbound