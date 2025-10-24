import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateInvoicePDF } from "./pdfCreation.js"; // make sure this generates PDF in memory
dotenv.config();

// Create a single Gmail transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD, // app password if using Gmail 2FA
  },
});

// Generic email sender
export const sendEmail = async (to, subject, text) => {
  try {
    const recipientEmail = to.replace(/['"]/g, "").trim();

    const mailOptions = {
      from: `"Warehouse" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}`);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

// Send invoice email with PDF attachment
export const sendInvoiceEmail = async (order, warehouse) => {
  try {
    // Generate PDF in memory
    const pdfBuffer = await generateInvoicePDFBuffer(order, warehouse);

    const recipientEmail = order.companyDetails.email.replace(/['"]/g, "").trim();

    const mailOptions = {
      from: `"Warehouse" <${process.env.EMAIL}>`,
      to: recipientEmail,
      subject: `Invoice for Order ${order._id}`,
      text: `Hello ${order.companyDetails.name},\n\nPlease find attached the invoice for your recent order.`,
      attachments: [
        {
          filename: `invoice_${order._id}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Invoice email sent to ${recipientEmail}`);
  } catch (err) {
    console.error("Error sending invoice email:", err);
    throw err;
  }
};
