// Utilities&MiddleWare/orderValidation.js
import { body, validationResult } from "express-validator";

export const orderValidation = [
  body("companyId")
    .notEmpty()
    .withMessage("Company ID is required"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("Products array must have at least one product"),

  body("products.*.productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("generatePDF")
    .optional()
    .isBoolean()
    .withMessage("generatePDF must be a boolean"),

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
