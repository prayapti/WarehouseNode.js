import Company from "../model/Company.js";
import { validationResult } from "express-validator";

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

const companies = await Company.find({
  user: req.user.id,  // <- only fetch companies for this user
  ...query            // include search/type/status filters
}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
      error: error.message,
    });
  }
};

// Get single company
export const getCompanyById = async (req, res) => {
  try {
const company = await Company.findOne({
  _id: req.params.id,
  user: req.user.id 
});

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company",
      error: error.message,
    });
  }
};

// Create new company
export const createCompany = async (req, res) => {
  try {
    console.log('req.user:', req.user); // debug before creating company

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const companyData = { ...req.body };

    // Handle file upload
    if (req.file) {
      companyData.document = req.file.path;
    }

const company = await Company.create({
  ...companyData,          // all other fields from req.body
 user:req.user.id // attach warehouse here
});

    res.status(201).json({
      success: true,
      message: "Company created successfully ",
      data: company,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating company",
      error: error.message,
    });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    // Convert body safely
    const body = Object.fromEntries(Object.entries(req.body));
    console.log("Incoming Data:", body);

    const updateData = {};

    if (body.name) updateData.name = body.name.trim();
    if (body.contact) updateData.contact = body.contact.trim();
    if (body.email) updateData.email = body.email.toLowerCase().trim();
    if (body.phone) updateData.phone = body.phone.trim();
    if (body.address) updateData.address = body.address.trim();
    if (body.type) updateData.type = body.type;
    if (body.status) updateData.status = body.status;
    if (body.GSTIN) updateData.GSTIN = body.GSTIN.trim();

    // Handle file upload
    if (req.file) {
      updateData.document = req.file.path;
    }
console.log("🆔 ID to Update:", req.params.id);

    updateData.updatedAt = new Date();

    const company = await Company.findOneAndUpdate(
  { _id: req.params.id, user: req.user.id }, // restrict to this user
  updateData,
  { new: true, runValidators: true }
);

     console.log("Updated Company:", company);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating company",
      error: error.message,
    });
  }
};


// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const order = await Order.findOne({ company: req.params.id });
    if (order) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete company with existing orders",
      });
    }

const company = await Company.findOneAndDelete({
  _id: req.params.id,
  user: req.user.id // <- only delete own companies
});

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};
