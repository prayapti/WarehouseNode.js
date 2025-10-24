import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Make sure your .env has: JWT_SECRET=your_secret_key

/**
 * Generate JWT token
 * @param {Object} user - user object containing at least _id and email
 * @returns {string} token
 */
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email ,warehouse: user.warehouse },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // optional chaining

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
