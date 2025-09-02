import express from 'express';
const router = express.Router();

import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controller/companyController.js';

import { companyValidation } from '../Utilities&MiddleWare/validation.js';
import upload from '../Utilities&MiddleWare/fileUpload.js';

// Company routes

// GET all companies → GET /order-management/companies
router.get('/', getAllCompanies);

// GET single company → GET /order-management/companies/:id
router.get('/:id', getCompanyById);

// POST new company → POST /order-management/companies
router.post('/', upload.single('document'), companyValidation, createCompany);

// PUT update company → PUT /order-management/companies/:id
router.put('/:id', upload.single('document'), companyValidation, updateCompany);

// DELETE company → DELETE /order-management/companies/:id
router.delete('/:id', deleteCompany);

export default router;
