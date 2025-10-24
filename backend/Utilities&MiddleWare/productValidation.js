// Utilities&MiddleWare/productValidation.js
import { body, validationResult } from "express-validator";

export const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be >= 0"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be >= 0"),
  body("supplier").notEmpty().withMessage("Supplier is required"),
  body("status")
    .isIn(["active", "inactive", "discontinued"])
    .withMessage("Status must be active, inactive, or discontinued"),

  // Middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    next();
  },
];
