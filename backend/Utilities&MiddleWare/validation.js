// Utilities&MiddleWare/validation.js
import { body } from "express-validator";

export const companyValidation = [
  body("name").notEmpty().withMessage("Company name is required"),
  body("contact").notEmpty().withMessage("Contact person is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("type")
    .isIn(["Technology", "Retail", "Manufacturing", "Healthcare", "Food & Beverage", "Other"])
    .withMessage("Invalid company type"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
  body("GSTIN")
    .optional()
    .isString()
];
