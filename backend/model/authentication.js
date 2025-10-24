import mongoose from "mongoose";


const authentication = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newUser1",
        required: true,
    },
    email:{
        type:String,
        required:true,

    },
    name: {
          type: String,
          required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },
   
    
},{timestamps:true});

const newUser = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
      
    isVerified: { type: Boolean, default: false }
    
},{timestamps:true});


const otp = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "newUser1",
        required: true,
    },
    otp:{
        type:String,
        required:true,
    },
    
    resendCount: { type: Number, default: 0 }  // track max resend
}, { timestamps: true });






export const User = mongoose.model("User", newUser);
export const Authentication = mongoose.model("Authentication", authentication);
export const otpDB = mongoose.model("otp_generate_and_save",otp);
