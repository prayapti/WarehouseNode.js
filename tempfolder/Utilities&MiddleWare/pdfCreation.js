import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order, warehouse) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ----- HEADER -----
      doc.fontSize(22).text("INVOICE", { align: "center" }).moveDown(1);

      const leftX = 50;
      const rightX = 350;
      const topY = doc.y;

      // Company Info
      doc.fontSize(10)
        .text("Bill To:", leftX, topY)
        .font("Helvetica-Bold")
        .text(order.companyDetails.name, leftX)
        .font("Helvetica")
        .text(order.companyDetails.address, leftX)
        .text(`Email: ${order.companyDetails.email}`, leftX)
        .text(`Phone: ${order.companyDetails.phone}`, leftX)
        .text(`GSTIN: ${order.companyDetails.GSTIN}`, leftX);

      // Warehouse Info
      doc.fontSize(10)
        .text("Ship From:", rightX, topY)
        .font("Helvetica-Bold")
        .text(warehouse.name, rightX)
        .font("Helvetica")
        .text(warehouse.address, rightX)
        .text(`Email: ${warehouse.email || "-"}`, rightX)
        .text(`Phone: ${warehouse.phone || "-"}`, rightX)
        .text(`GSTIN: ${warehouse.GSTIN}`, rightX);

      doc.moveDown(2);

      // Order Info
      doc.fontSize(12)
        .font("Helvetica-Bold")
        .text(`Order ID: ${order._id}`)
        .font("Helvetica")
        .text(`Order Type: ${order.orderType}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
        .moveDown(1);

      // Table Header
      const tableTop = doc.y;
      const colWidths = { sn: 30, name: 150, cat: 100, qty: 40, unit: 60, total: 60 };
      doc.fontSize(11).font("Helvetica-Bold")
        .text("S.N", leftX, tableTop, { width: colWidths.sn })
        .text("Product", leftX + colWidths.sn, tableTop, { width: colWidths.name })
        .text("Category", leftX + colWidths.sn + colWidths.name, tableTop, { width: colWidths.cat })
        .text("Qty", leftX + colWidths.sn + colWidths.name + colWidths.cat, tableTop, { width: colWidths.qty })
        .text("Unit Price", leftX + colWidths.sn + colWidths.name + colWidths.cat + colWidths.qty, tableTop, { width: colWidths.unit })
        .text("Total", leftX + colWidths.sn + colWidths.name + colWidths.cat + colWidths.qty + colWidths.unit, tableTop, { width: colWidths.total });

      doc.font("Helvetica");
      order.products.forEach((p, i) => {
        const y = doc.y;
        doc.text(i + 1, leftX, y, { width: colWidths.sn })
          .text(p.productDetails.name, leftX + colWidths.sn, y, { width: colWidths.name })
          .text(p.productDetails.category, leftX + colWidths.sn + colWidths.name, y, { width: colWidths.cat })
          .text(p.quantity, leftX + colWidths.sn + colWidths.name + colWidths.cat, y, { width: colWidths.qty })
          .text(`$${p.unitPrice.toFixed(2)}`, leftX + colWidths.sn + colWidths.name + colWidths.cat + colWidths.qty, y, { width: colWidths.unit })
          .text(`$${p.totalPrice.toFixed(2)}`, leftX + colWidths.sn + colWidths.name + colWidths.cat + colWidths.qty + colWidths.unit, y, { width: colWidths.total });
        doc.moveDown(0.5);
      });

      doc.moveDown(1);
      doc.fontSize(12).font("Helvetica-Bold")
        .text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { align: "right" })
        .moveDown(1);

      doc.fontSize(10).font("Helvetica-Oblique")
        .text("Thank you for your business!", { align: "center" })
        .moveDown(0.5)
        .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
