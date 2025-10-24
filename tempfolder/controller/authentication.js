import { Authentication, User, otpDB } from "../model/authentication.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Utilities&MiddleWare/jwt.js";
import { transporter, sendEmail } from "../Utilities&MiddleWare/email.js";


import dotenv from "dotenv";
dotenv.config();

//Basic Login
export const Login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please Provide both credentials!" });
    }
    const password = req.body.password;
    const User1 = await User.findOne({ email: req.body.email });
    if (!User1) {
      return res.status(400).json({ message: "User not Found!" });
    }
    const token = generateToken(User1);
    const isMatch = await bcrypt.compare(password, User1.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }
    console.log(token);
    return res
      .status(200)
      .json({ message: "Login Successfull" ,token});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: `${err.message}` });
  }
};

const saltround = 10;

//registration ka code

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(403).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const otp = OtpGenerator();
        await otpDB.updateOne({ userId: existingUser._id }, { otp });
        await sendEmail(
          req.body.email,
          `Verification Email `,
          `Dear ${req.body.name} \n Thank you for choosing us! Here is the Verification code \n
      OTP :- ${otp}\n Best regards\nTechnical Team\n TG`
        );
        return res.status(200).json({ message: "OTP resent" });
      }
    }
    let otp = OtpGenerator();
    const hashedPassword = await bcrypt.hash(req.body.password, saltround);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    const otp1 = await otpDB.create({
      userId: newUser._id,
      otp: otp,
    });
    await sendEmail(
      req.body.email,
      `Verification Email `,
      `Dear ${req.body.name} \n Thank you for choosing us! Here is the Verification code \n
      OTP :- ${otp}\n Best regards\nTechnical Team\n TG`
    );
    console.log(otp);

    return res.status(200).json({ "Here is the OTP ": otp });
  } catch (err) {
    console.log("Error:-" + err.message);
    return res.status(500).json({ message: `${err.message}` });
  }
};

//OTPverification for registration of new user

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "Please enter the OTP" });
    }

    const existingOtp = await otpDB.findOne({ otp });
    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const userDoc = await User.findOne({ _id: existingOtp.userId });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found for this OTP" });
    }

    userDoc.isVerified = true;
    const savedUser = await userDoc.save();

    // Remove OTP so it can't be reused
    await otpDB.deleteOne({ _id: existingOtp._id });
    const token = generateToken(savedUser);
    res
      .status(200)
      .json({ message: "User verified successfully", user: savedUser, token });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ message: err.message });
  }
};

//otp generator Function
const OtpGenerator = () => {
  let otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  return otp;
};
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    let existingOtp = await otpDB.findOne({ userId: user._id });
    const now = new Date();

    // Initialize if first time
    if (!existingOtp) {
      existingOtp = await otpDB.create({ userId: user._id, otp: 0, resendCount: 0 });
    }

    // 30-second cooldown
    if (existingOtp.updatedAt) {
      const secondsSinceLastSend = (now - existingOtp.updatedAt) / 1000;
      if (secondsSinceLastSend < 30) {
        return res.status(429).json({ 
          message: `Please wait ${Math.ceil(30 - secondsSinceLastSend)} seconds before resending OTP`
        });
      }
    }

    // Max 5 resends per hour
    if (existingOtp.resendCount >= 5) {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      if (existingOtp.updatedAt > oneHourAgo) {
        return res.status(429).json({ 
          message: "You have reached the maximum number of OTP requests. Try again later."
        });
      } else {
        existingOtp.resendCount = 0; // reset after 1 hour
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Update DB
    await otpDB.updateOne(
      { userId: user._id },
      { otp, updatedAt: now, $inc: { resendCount: 1 } },
      { upsert: true }
    );

    // Send OTP email
    await sendEmail(
      email,
      "Verification Email",
      `Dear ${user.name},\nYour new OTP is: ${otp}\nBest regards,\nTG Team`
    );

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};
