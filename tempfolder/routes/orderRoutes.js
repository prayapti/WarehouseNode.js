import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import Order from "../model/Order.js"; 
import { cloudinary } from "../Utilities&MiddleWare/cloudinary.js";

import express from 'express';
const router = express.Router();

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  getDashboardSummary,
  getDashboardStatus,
  getDashboardRecentOrders

} from '../controller/orderController.js';
import { orderValidation } from '../Utilities&MiddleWare/orderValidation.js';
import { authenticateToken } from "../Utilities&MiddleWare/jwt.js";
import upload from '../Utilities&MiddleWare/fileUpload.js';

// Dashboard Routes
router.get("/summary", getDashboardSummary);
router.get("/status", getDashboardStatus);
router.get("/recent-orders", getDashboardRecentOrders);


// Create new order → POST /order-management/orders
router.post('/', upload.array('documents'),authenticateToken, orderValidation, createOrder);

// Get all orders → GET /order-management/orders
router.get('/', authenticateToken,getAllOrders);

// Generate & download invoice PDF

router.get("/orders/generate-invoice/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
      res.send(pdfBuffer);
    });

    const company = order.companyDetails || {};

    // === HEADER ===
    doc.rect(0, 0, doc.page.width, 80).fill('#f2f2f2');
    doc.fillColor('#000').fontSize(20).text("INVOICE", 400, 30, { align: 'right' });

    // Logo Circle
    doc.circle(60, 60, 30).stroke();
    try {
      doc.image('path/to/logo.png', 35, 35, { width: 50 });
    } catch (e) {}

    // Company Info
    doc.fontSize(10).fillColor('#000')
       .text(company.name || "Company Name", 400, 60, { align: 'right' })
       .text(company.address || "", { align: 'right' })
       .text(company.email || "", { align: 'right' })
       .text(company.phone || "", { align: 'right' });

    // Vertical Invoice Number
    doc.save();
    doc.rotate(90, { origin: [20, 300] });
    doc.fontSize(14).fillColor('#007BFF').text(`INVOICE #${order.orderId}`, 300, -30);
    doc.restore();

    // === INVOICE DETAILS BOX ===
    doc.rect(50, 100, 500, 60).strokeColor('#007BFF').lineWidth(1).stroke();
    doc.fontSize(10).fillColor('#000')
       .text(`Invoice Date: ${order.createdAt?.toDateString() || "N/A"}`, 60, 115)
       .text(`Due Date: ${order.dueDate || "N/A"}`, 200, 115)
       .text(`Terms: ${order.terms || "N/A"}`, 350, 115);

    doc.moveDown(3);

    // === BILLING INFO ===
    doc.fontSize(12).fillColor('#007BFF').text('Billing Information', 50, doc.y, { underline: true });
    doc.fontSize(10).fillColor('#000')
       .text(`Name: ${company.name || "N/A"}`)
       .text(`Address: ${company.address || "N/A"}`)
       .text(`Email: ${company.email || "N/A"}`)
       .text(`Phone: ${company.phone || "N/A"}`)
       .text(`GSTIN: ${company.GSTIN || "N/A"}`);

    doc.moveDown();

    // === ITEM TABLE HEADER ===
    const startY = doc.y;
    doc.fontSize(10).fillColor('#007BFF');
    doc.text('DESCRIPTION', 50, startY);
    doc.text('QTY', 250, startY);
    doc.text('UNIT PRICE', 320, startY);
    doc.text('TOTAL', 420, startY);
    doc.moveTo(50, startY + 15).lineTo(500, startY + 15).strokeColor('#007BFF').stroke();
    doc.moveDown(1);

    // === ITEM TABLE CONTENT ===
    (order.products || []).forEach(p => {
      const pd = p.productDetails || {};
      const rowY = doc.y;
      doc.fillColor('#000').fontSize(10)
         .text(pd.name || "N/A", 50, rowY)
         .text(p.quantity?.toString() || "0", 250, rowY)
         .text(`₹${p.unitPrice?.toFixed(2) || "0.00"}`, 320, rowY)
         .text(`₹${p.totalPrice?.toFixed(2) || "0.00"}`, 420, rowY);
      doc.moveDown(1);
    });

    // === SUMMARY BOX ===
    const subtotal = (order.products || []).reduce((sum, p) => sum + (p.totalPrice || 0), 0);
    const discount = order.discount || 0;
    const taxRate = 0.18;
    const taxDue = subtotal * taxRate;
    const total = subtotal + taxDue - discount;

    const summaryY = doc.y;
    doc.rect(300, summaryY, 200, 80).strokeColor('#007BFF').stroke();
    doc.fontSize(10).fillColor('#000')
       .text(`Subtotal: ₹${subtotal.toFixed(2)}`, 310, summaryY + 5)
       .text(`Discount: ₹${discount.toFixed(2)}`, 310, summaryY + 20)
       .text(`Tax Rate: 18%`, 310, summaryY + 35)
       .text(`Tax Due: ₹${taxDue.toFixed(2)}`, 310, summaryY + 50)
       .text(`Total: ₹${total.toFixed(2)}`, 310, summaryY + 65);

    // === FOOTER ===
    doc.moveDown(2);
    doc.fontSize(12).fillColor('#007BFF').text('Terms & Instructions', { underline: true });
    doc.fontSize(10).fillColor('#000')
       .text('Bank: XYZ Bank')
       .text('Account No: 123456789')
       .text('IFSC: XYZ123')
       .text('Payment Terms: Due within 30 days')
       .text('Late Payment Fee: 2% per month');

    doc.moveDown(1);
    doc.fontSize(12).fillColor('#007BFF').text('Thank you for your business!', { align: 'center' });

    doc.end();

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Server error generating PDF" });
  }
})

// Get single order → GET /order-management/orders/:id
router.get('/:id',authenticateToken, getOrderById);

// Update order status → PUT /order-management/orders/:id/status
router.put('/:id/status',authenticateToken, updateOrderStatus);

// Delete order → DELETE /order-management/orders/:id
router.delete('/:id', authenticateToken,deleteOrder);

// Order statistics → GET /order-management/orders-stats
router.get('/stats',authenticateToken, getOrderStats);



export default router;
